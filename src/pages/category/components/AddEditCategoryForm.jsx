import { AppstoreOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Form, Input, Row, Select, Space, Spin, notification } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { getConstructionList } from '../../construction/redux/construction.slice';
import { addCategory, getCategoryList, updateCategory } from '../redux/category.slice';

const initialState = {
  code: '',
  name: '',
  cong_trinh_id: '',
};

export default function AddEditCategoryForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.category.loading);

  const selectedCategory = useSelector((state) => state.category.editingCategory);
  console.log('editingCategory:', selectedCategory);
  const dispatch = useAppDispatch();

  const constructions = useSelector((state) => state.construction.constructionList);

  useEffect(() => {
    // Lấy danh sách công trình khi mở form
    dispatch(getConstructionList({ pageNo: 0, pageSize: 100, searchText: '' }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      setInitialValues({
        code: selectedCategory.code || '',
        name: selectedCategory.name || '',
        cong_trinh_id: selectedCategory.cong_trinh_id || '',
      });
    } else {
      setInitialValues(initialState);
    }
  }, [selectedCategory]);
  const onFinish = async (values) => {
    try {
      if (!selectedCategory) {
        const payload = {
          code: values.code,
          name: values.name,
          cong_trinh_id: values.cong_trinh_id,
        };

        try {
          await dispatch(addCategory(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm hạng mục thành công',
          });

          // get new category list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          await dispatch(getCategoryList(filters));

          onClose();
          navigate('/dashboard/administration/category');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi thêm hạng mục',
          });
          return;
        }
      } else {
        const payload = {
          id: selectedCategory.id,
          code: values.code,
          name: values.name,
          cong_trinh_id: values.cong_trinh_id,
        };
        try {
          await dispatch(updateCategory(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật hạng mục thành công',
          });
          // get new category list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          await dispatch(getCategoryList(filters));
          onClose();
          navigate('/dashboard/administration/category');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi cập nhật hạng mục',
          });
          return;
        }
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu',
      });
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
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
            icon={<AppstoreOutlined />}
            style={{ backgroundColor: isEmpty(selectedCategory) ? '#1890ff' : '#52c41a' }}
          />
          <span>
            {isEmpty(selectedCategory) ? 'Thêm mới hạng mục' : `Sửa hạng mục ${initialValues && initialValues?.code}`}
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
            {isEmpty(selectedCategory) ? 'Thêm hạng mục' : 'Cập nhật'}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
      {' '}
      {!isEmpty(selectedCategory) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin hạng mục..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-category"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          {' '}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã hạng mục"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập mã hạng mục!',
                  },
                ]}
                tooltip="Mã hạng mục phải là duy nhất"
              >
                <Input autoFocus placeholder="Nhập mã hạng mục" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên hạng mục"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập tên hạng mục!',
                  },
                ]}
              >
                <Input placeholder="Nhập tên hạng mục" />
              </Form.Item>
            </Col>
          </Row>{' '}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Công trình"
                name="cong_trinh_id"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải chọn công trình!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn công trình"
                  options={constructions.map((c) => ({ label: c.name, value: c.id }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                />
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
