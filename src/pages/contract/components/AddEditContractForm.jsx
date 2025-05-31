import { CloseCircleOutlined, FileTextOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Form, Input, notification, Row, Select, Space, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DocumentImageUpload } from '../../../components/upload';
import { useAppDispatch } from '../../../redux/store';
import {
  deleteContractDocument,
  deleteContractImage,
  getContractDocuments,
  uploadContractDocument,
  uploadContractImage,
} from '../../../services/uploadService';
import { getBusinessList } from '../../business/redux/business.slice';
import { getConstructionList } from '../../construction/redux/construction.slice';
import { getProjectList } from '../../project/redux/project.slice';
import { addContract, getContractList, updateContract } from '../redux/contract.slice';

const initialState = {
  code: '',
  name: '',
  description: '',
  du_an_id: '',
  cong_trinh_id: '',
  ben_a_id: '',
  ben_b_id: '',
};

export default function AddEditContractForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const [projects, setProjects] = useState([]);
  const [constructions, setConstructions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingConstructions, setLoadingConstructions] = useState(false);

  const loading = useSelector((state) => state.contract.loading);
  const selectedContract = useSelector((state) => state.contract.editingContract);
  const dispatch = useAppDispatch();
  // Upload handlers for contract
  const handleContractImageUpload = async (file, contractId) => {
    const parentId = null;
    return await uploadContractImage(file, contractId, parentId);
  };

  const handleContractDocumentUpload = async (file, contractId) => {
    const parentId = null;
    return await uploadContractDocument(file, contractId, parentId);
  };

  const handleContractImageDelete = async (imageId, contractId) => {
    return await deleteContractImage(imageId, contractId);
  };

  const handleContractDocumentDelete = async (documentId, contractId) => {
    return await deleteContractDocument(documentId, contractId);
  };

  const handleLoadContractDocuments = async (contractId) => {
    return await getContractDocuments(contractId);
  };
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectResult = await dispatch(getProjectList({ pageNo: 0, pageSize: 100 })).unwrap();
        if (projectResult?.data) {
          setProjects(projectResult.data);
        }

        // Fetch companies
        const companyResult = await dispatch(getBusinessList({ pageNo: 0, pageSize: 100 })).unwrap();
        if (companyResult?.data) {
          setCompanies(companyResult.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        notification.error({
          message: 'Lỗi',
          description: 'Không thể tải dữ liệu',
        });
      }
    };

    fetchData();
  }, [dispatch]);
  // Handle project selection change
  const handleProjectChange = async (value) => {
    // Clear construction field when project changes
    form.setFieldsValue({ cong_trinh_id: undefined });
    setConstructions([]);

    if (!value) {
      return;
    }

    setLoadingConstructions(true);
    try {
      const res = await dispatch(getConstructionList({ pageNo: 0, pageSize: 100, du_an_id: value })).unwrap();
      setConstructions(res.data || []);
    } catch (error) {
      console.error('Failed to fetch constructions:', error);
      setConstructions([]);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách công trình',
      });
    } finally {
      setLoadingConstructions(false);
    }
  }; // Set initial values for editing
  useEffect(() => {
    if (selectedContract) {
      const formattedContract = {
        ...selectedContract,
      };
      setInitialValues(formattedContract);

      // Load constructions for the selected project
      if (selectedContract.du_an_id) {
        setLoadingConstructions(true);
        dispatch(getConstructionList({ pageNo: 0, pageSize: 100, du_an_id: selectedContract.du_an_id }))
          .unwrap()
          .then((res) => setConstructions(res.data || []))
          .catch((error) => {
            console.error('Failed to fetch constructions:', error);
            setConstructions([]);
          })
          .finally(() => setLoadingConstructions(false));
      }
    } else {
      setInitialValues(initialState);
      setConstructions([]);
    }
  }, [selectedContract, dispatch]);

  // Reset fields khi mở form mới
  useEffect(() => {
    if (open) {
      form.resetFields();
      if (selectedContract) {
        form.setFieldsValue({ ...selectedContract });
      }
    }
  }, [open, selectedContract, form]);

  const onFinish = async (values) => {
    try {
      if (!selectedContract) {
        const payload = {
          code: values.code,
          name: values.name,
          description: values.description,
          du_an_id: values.du_an_id,
          cong_trinh_id: values.cong_trinh_id,
          ben_a_id: values.ben_a_id,
          ben_b_id: values.ben_b_id,
        };

        try {
          await dispatch(addContract(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm hợp đồng thành công',
          });

          // get new contract list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };

          await dispatch(getContractList(filters));

          onClose();

          navigate('/dashboard/contract');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi thêm hợp đồng',
          });
          return;
        }
      } else {
        const payload = {
          id: selectedContract.id,
          code: values.code,
          name: values.name,
          description: values.description,
          du_an_id: values.du_an_id,
          cong_trinh_id: values.cong_trinh_id,
          ben_a_id: values.ben_a_id,
          ben_b_id: values.ben_b_id,
        };
        try {
          await dispatch(updateContract(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật hợp đồng thành công',
          });

          // get new contract list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };

          await dispatch(getContractList(filters));

          onClose();

          navigate('/dashboard/contract');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi cập nhật hợp đồng',
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
    notification.error({ message: 'Lỗi', description: errorInfo.message ?? 'Đã xảy ra lỗi khi xử lý yêu cầu' });
  };

  return (
    <Drawer
      width={window.innerWidth > 768 ? 720 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<FileTextOutlined />}
            style={{ backgroundColor: isEmpty(selectedContract) ? '#1890ff' : '#52c41a' }}
          />
          <span>{isEmpty(selectedContract) ? 'Thêm mới hợp đồng' : `Sửa hợp đồng ${initialValues?.code || ''}`}</span>
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
            {isEmpty(selectedContract) ? 'Tạo hợp đồng' : 'Cập nhật'}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
      {' '}
      {!isEmpty(selectedContract) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin hợp đồng..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-contract"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã hợp đồng"
                name="code"
                rules={[{ required: true, message: 'Vui lòng nhập mã hợp đồng!' }]}
                tooltip="Mã hợp đồng phải là duy nhất"
              >
                <Input autoFocus placeholder="Nhập mã hợp đồng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên hợp đồng"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên hợp đồng!' }]}
              >
                <Input placeholder="Nhập tên hợp đồng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả hợp đồng!' }]}
              >
                <TextArea rows={4} placeholder="Nhập mô tả chi tiết về hợp đồng" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Dự án" name="du_an_id" rules={[{ required: true, message: 'Vui lòng chọn dự án!' }]}>
                <Select
                  placeholder="Chọn dự án"
                  options={projects.map((p) => ({ label: p.name, value: p.id }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  onChange={handleProjectChange}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Công trình"
                name="cong_trinh_id"
                rules={[{ required: true, message: 'Vui lòng chọn công trình!' }]}
              >
                <Select
                  placeholder="Chọn công trình"
                  loading={loadingConstructions}
                  options={constructions.map((c) => ({ label: c.name, value: c.id }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  allowClear
                  disabled={!form.getFieldValue('du_an_id') || loadingConstructions}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bên A" name="ben_a_id" rules={[{ required: true, message: 'Vui lòng chọn Bên A!' }]}>
                <Select
                  placeholder="Chọn Bên A"
                  options={companies.map((c) => ({ label: c.name, value: c.id }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Bên B" name="ben_b_id" rules={[{ required: true, message: 'Vui lòng chọn Bên B!' }]}>
                <Select
                  placeholder="Chọn Bên B"
                  options={companies.map((c) => ({ label: c.name, value: c.id }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                  allowClear
                />
              </Form.Item>{' '}
            </Col>
          </Row>

          {/* Upload section - only show in edit mode */}
          {selectedContract && (
            <DocumentImageUpload
              entityId={selectedContract.id}
              entityType="Hợp đồng"
              onUploadImage={handleContractImageUpload}
              onUploadDocument={handleContractDocumentUpload}
              onDeleteImage={handleContractImageDelete}
              onDeleteDocument={handleContractDocumentDelete}
              onLoadDocuments={handleLoadContractDocuments}
              showImageUpload={true}
              showDocumentUpload={true}
              imageTitle="Hình ảnh hợp đồng"
              documentTitle="Tài liệu hợp đồng"
            />
          )}
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
