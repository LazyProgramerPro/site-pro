import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Spin,
  notification,
  Space,
  Avatar,
  InputNumber,
  Upload,
} from 'antd';
import { FileTextOutlined, CloseCircleOutlined, SaveOutlined, InboxOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { addContractAddendum, getContractAddendumList, updateContractAddendum } from '../redux/contractAddendum.slide';
import { getCategoryList } from '../../category/redux/category.slice';
import { getGroupList } from '../../group/redux/group.slice';
import { getBusinessList } from '../../business/redux/business.slice';

const initialState = {
  code: '',
  name: '',
  description: '',
  hang_muc_id: '',
  nhom_hang_muc_id: '',
  don_vi: '',
  khoi_luong: 0,
  don_gia: 0,
  thanh_tien: 0,
  nha_thau_thi_cong_id: '',
  tu_van_giam_sat_id: '',
  tu_van_thiet_ke_id: '',
  documents: [],
};

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function AddEditContractAddendumForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const loading = useSelector((state) => state.contractAddendum.loading);
  const selectedContractAddendum = useSelector((state) => state.contractAddendum.editingContractAddendum);
  const selectedContract = useSelector((state) => state.contract.editingContract);

  // Data từ database
  const categoryList = useSelector((state) => state.category.categoryList);
  const groupList = useSelector((state) => state.group.groupList);

  console.log('groupList:', selectedContractAddendum);
  const businessList = useSelector((state) => state.business.businessList);
  const dispatch = useAppDispatch();

  // Load data from database when component mounts
  useEffect(() => {
    const loadBasicData = async () => {
      try {
        // Load categories (hạng mục)
        await dispatch(getCategoryList({ pageNo: 0, pageSize: 100, searchText: '' }));

        // Load groups (nhóm hạng mục)
        await dispatch(getGroupList({ pageNo: 0, pageSize: 100, searchText: '' }));

        // Load businesses (doanh nghiệp/nhà thầu)
        await dispatch(getBusinessList({ pageNo: 0, pageSize: 100, searchText: '' }));
      } catch (error) {
        console.error('Error loading basic data:', error);
      }
    };

    loadBasicData();
  }, [dispatch]);
  // Set initial values for editing
  useEffect(() => {
    if (selectedContractAddendum) {
      setInitialValues(selectedContractAddendum);
    } else {
      setInitialValues(initialState);
    }
  }, [selectedContractAddendum]);

  // Reset fields when opening form and load data for edit mode
  useEffect(() => {
    if (open) {
      form.resetFields();
      if (selectedContractAddendum) {
        // Load nhóm hạng mục theo hạng mục đã chọn trước khi set form values
        if (selectedContractAddendum.hang_muc_id) {
          dispatch(
            getGroupList({
              pageNo: 0,
              pageSize: 100,
              searchText: '',
              hang_muc_id: selectedContractAddendum.hang_muc_id,
            }),
          )
            .unwrap()
            .then(() => {
              // Sau khi load xong danh sách nhóm hạng mục, mới set form values
              form.setFieldsValue({ ...selectedContractAddendum });
            })
            .catch((error) => {
              console.error('Error loading groups for edit:', error);
              // Nếu có lỗi, vẫn set form values
              form.setFieldsValue({ ...selectedContractAddendum });
            });
        } else {
          // Nếu không có hang_muc_id, vẫn set form values
          form.setFieldsValue({ ...selectedContractAddendum });
        }
      }
    }
  }, [open, selectedContractAddendum, form, dispatch]); // Auto calculate total amount
  const handleCalculateTotal = () => {
    const khoi_luong = form.getFieldValue('khoi_luong') || 0;
    const don_gia = form.getFieldValue('don_gia') || 0;
    const total = khoi_luong * don_gia;
    form.setFieldsValue({ thanh_tien: total });
  };
  // Handle category change - reset group and reload group list
  const handleCategoryChange = async (categoryId) => {
    // Reset nhóm hạng mục field
    form.setFieldValue('nhom_hang_muc_id', undefined);

    if (categoryId) {
      try {
        // Load nhóm hạng mục theo hạng mục đã chọn
        await dispatch(
          getGroupList({
            pageNo: 0,
            pageSize: 100,
            searchText: '',
            hang_muc_id: categoryId,
          }),
        );
      } catch (error) {
        console.error('Error loading groups by category:', error);
      }
    } else {
      // Nếu không chọn hạng mục, load toàn bộ nhóm hạng mục
      await dispatch(getGroupList({ pageNo: 0, pageSize: 100, searchText: '' }));
    }
  };
  const onFinish = async (values) => {
    try {
      if (!selectedContractAddendum) {
        const payload = {
          code: values.code,
          name: values.name,
          description: values.description,
          du_an_id: selectedContract?.du_an_id,
          cong_trinh_id: selectedContract?.cong_trinh_id,
          hop_dong_id: selectedContract?.id,
          hang_muc_id: values.hang_muc_id,
          nhom_hang_muc_id: values.nhom_hang_muc_id,
          don_vi: values.don_vi,
          khoi_luong: values.khoi_luong,
          don_gia: values.don_gia,
          thanh_tien: values.thanh_tien,
          nha_thau_thi_cong_id: values.nha_thau_thi_cong_id,
          tu_van_giam_sat_id: values.tu_van_giam_sat_id,
          tu_van_thiet_ke_id: values.tu_van_thiet_ke_id,
          documents: values.documents || [],
        };

        try {
          await dispatch(addContractAddendum(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm phụ lục hợp đồng thành công',
          });

          // get new contract list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
            du_an_id: selectedContract?.du_an_id,
            cong_trinh_id: selectedContract?.cong_trinh_id,
            hop_dong_id: selectedContract?.id,
          };

          await dispatch(getContractAddendumList(filters));

          onClose();
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi thêm phụ lục hợp đồng',
          });
          return;
        }
      } else {
        const payload = {
          id: selectedContractAddendum.id,
          code: values.code,
          name: values.name,
          description: values.description,
          du_an_id: selectedContract?.du_an_id,
          cong_trinh_id: selectedContract?.cong_trinh_id,
          hop_dong_id: selectedContract?.id,
          hang_muc_id: values.hang_muc_id,
          nhom_hang_muc_id: values.nhom_hang_muc_id,
          don_vi: values.don_vi,
          khoi_luong: values.khoi_luong,
          don_gia: values.don_gia,
          thanh_tien: values.thanh_tien,
          nha_thau_thi_cong_id: values.nha_thau_thi_cong_id,
          tu_van_giam_sat_id: values.tu_van_giam_sat_id,
          tu_van_thiet_ke_id: values.tu_van_thiet_ke_id,
          documents: values.documents || [],
        };

        try {
          await dispatch(updateContractAddendum(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật phụ lục hợp đồng thành công',
          });

          // get new contract list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
            du_an_id: selectedContract?.du_an_id,
            cong_trinh_id: selectedContract?.cong_trinh_id,
            hop_dong_id: selectedContract?.id,
          };

          await dispatch(getContractAddendumList(filters));

          onClose();
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi cập nhật phụ lục hợp đồng',
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu',
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    notification.error({
      message: 'Lỗi',
      description: errorInfo.message ?? 'Đã xảy ra lỗi khi xử lý yêu cầu',
    });
  };
  return (
    <Drawer
      width={window.innerWidth > 768 ? 720 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<FileTextOutlined />}
            style={{ backgroundColor: isEmpty(selectedContractAddendum) ? '#1890ff' : '#52c41a' }}
          />
          <span>
            {isEmpty(selectedContractAddendum)
              ? 'Thêm mới phụ lục hợp đồng'
              : `Sửa phụ lục hợp đồng ${initialValues?.code || ''}`}
          </span>
        </Space>
      }
      placement="right"
      onClose={onClose}
      open={open}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose} icon={<CloseCircleOutlined />}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
            disabled={loading}
            icon={<SaveOutlined />}
          >
            {isEmpty(selectedContractAddendum) ? 'Tạo phụ lục' : 'Cập nhật'}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
      {' '}
      {!isEmpty(selectedContractAddendum) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin phụ lục hợp đồng..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-contract-addendum"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={16}>
            {' '}
            <Col span={12}>
              <Form.Item
                label="Mã phụ lục hợp đồng"
                name="code"
                rules={[{ required: true, message: 'Vui lòng nhập mã phụ lục hợp đồng!' }]}
                tooltip="Mã phụ lục hợp đồng phải là duy nhất"
              >
                <Input autoFocus placeholder="Nhập mã phụ lục hợp đồng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên phụ lục hợp đồng"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên phụ lục hợp đồng!' }]}
              >
                <Input placeholder="Nhập tên phụ lục hợp đồng" />
              </Form.Item>
            </Col>
          </Row>{' '}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: false, message: 'Vui lòng nhập mô tả phụ lục hợp đồng!' }]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả chi tiết về phụ lục hợp đồng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            {' '}
            <Col span={12}>
              {' '}
              <Form.Item
                label="Hạng mục"
                name="hang_muc_id"
                rules={[{ required: true, message: 'Vui lòng chọn hạng mục!' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn hạng mục"
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  onChange={handleCategoryChange}
                  options={categoryList?.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {' '}
              <Form.Item
                label="Nhóm hạng mục"
                name="nhom_hang_muc_id"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm hạng mục!' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn nhóm hạng mục"
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  options={groupList?.map((group) => ({
                    label: group.name,
                    value: group.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Đơn vị" name="don_vi" rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}>
                <Input placeholder="Nhập đơn vị (kg, m2, m3, ...)" />
              </Form.Item>
            </Col>
          </Row>{' '}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Khối lượng"
                name="khoi_luong"
                rules={[{ required: true, message: 'Vui lòng nhập khối lượng!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập khối lượng"
                  min={0}
                  precision={2}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={handleCalculateTotal}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Đơn giá" name="don_gia" rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Nhập đơn giá"
                  min={0}
                  precision={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="VNĐ"
                  onChange={handleCalculateTotal}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Thành tiền"
                name="thanh_tien"
                rules={[{ required: true, message: 'Vui lòng nhập thành tiền!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Thành tiền"
                  min={0}
                  precision={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="VNĐ"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>{' '}
          <Row gutter={16}>
            <Col span={12}>
              {' '}
              <Form.Item
                label="Nhà thầu thi công"
                name="nha_thau_thi_cong_id"
                rules={[{ required: true, message: 'Vui lòng chọn nhà thầu thi công!' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn nhà thầu thi công"
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  options={businessList?.map((business) => ({
                    label: business.name,
                    value: business.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {' '}
              <Form.Item
                label="Tư vấn giám sát"
                name="tu_van_giam_sat_id"
                rules={[{ required: true, message: 'Vui lòng chọn tư vấn giám sát!' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn tư vấn giám sát"
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  options={businessList?.map((business) => ({
                    label: business.name,
                    value: business.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>{' '}
          <Row gutter={16}>
            <Col span={12}>
              {' '}
              <Form.Item
                label="Tư vấn thiết kế"
                name="tu_van_thiet_ke_id"
                rules={[{ required: true, message: 'Vui lòng chọn tư vấn thiết kế!' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn tư vấn thiết kế"
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  options={businessList?.map((business) => ({
                    label: business.name,
                    value: business.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tài liệu"
                name="documents"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                // rules={[{ required: false, message: 'Vui lòng chọn tài liệu!' }]}
                tooltip="Tải lên các tài liệu liên quan đến phụ lục hợp đồng"
              >
                <Upload.Dragger
                  name="documents"
                  multiple
                  listType="text"
                  beforeUpload={() => false}
                  showUploadList={{
                    showDownloadIcon: true,
                    showRemoveIcon: true,
                    showPreviewIcon: true,
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Nhấp hoặc kéo thả file vào vùng này để tải lên</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên đơn lẻ hoặc hàng loạt. Chỉ chấp nhận file PDF, DOC, DOCX, XLS, XLSX.
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>{' '}
        </Form>
      )}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <Spin size="large" tip="Đang xử lý..." />
        </div>
      )}
    </Drawer>
  );
}
