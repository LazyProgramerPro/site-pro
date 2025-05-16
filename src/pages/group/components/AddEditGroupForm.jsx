import { AppstoreOutlined, CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Form, Input, Row, Select, Space, Spin, notification } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { getCategoryList } from '../../category/redux/category.slice';
import { addGroup, getGroupList, updateGroup } from '../redux/group.slice';

const initialState = {
  code: '',
  name: '',
  hang_muc_id: '',
};

export default function AddEditGroupForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.group.loading);

  const selectedGroup = useSelector((state) => state.group.editingGroup);
  console.log('editingGroup:', selectedGroup);
  const dispatch = useAppDispatch();
  const categories = useSelector((state) => state.category.categoryList);

  useEffect(() => {
    // Lấy danh sách hạng mục khi mở form
    dispatch(getCategoryList({ pageNo: 0, pageSize: 100, searchText: '' }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroup) {
      setInitialValues({
        code: selectedGroup.code || '',
        name: selectedGroup.name || '',
        hang_muc_id: selectedGroup.hang_muc_id || '',
      });
    } else {
      setInitialValues(initialState);
    }
  }, [selectedGroup]);
  const onFinish = async (values) => {
    try {
      if (!selectedGroup) {
        const payload = {
          code: values.code,
          name: values.name,
          hang_muc_id: values.hang_muc_id,
        };

        try {
          await dispatch(addGroup(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm nhóm hạng mục thành công',
          });

          // get new group list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          await dispatch(getGroupList(filters));

          onClose();
          navigate('/dashboard/administration/group');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi thêm nhóm hạng mục',
          });
          return;
        }
      } else {
        const payload = {
          id: selectedGroup.id,
          code: values.code,
          name: values.name,
          hang_muc_id: values.hang_muc_id,
        };
        try {
          await dispatch(updateGroup(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật nhóm hạng mục thành công',
          });
          // get new group list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          await dispatch(getGroupList(filters));
          onClose();
          navigate('/dashboard/administration/group');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi cập nhật nhóm hạng mục',
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
      message: 'Errors',
      description: errorInfo.message,
    });
  };
  return (
    <Drawer
      width={window.innerWidth > 768 ? 720 : '100%'}
      title={
        <Space align="center">
          <Avatar
            icon={<AppstoreOutlined />}
            style={{ backgroundColor: isEmpty(selectedGroup) ? '#1890ff' : '#52c41a' }}
          />
          <span>
            {isEmpty(selectedGroup)
              ? 'Thêm mới nhóm hạng mục'
              : `Sửa nhóm hạng mục ${initialValues && initialValues?.code}`}
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
            {isEmpty(selectedGroup) ? 'Thêm nhóm hạng mục' : 'Cập nhật'}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
      {' '}
      {!isEmpty(selectedGroup) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin nhóm hạng mục..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-group"
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
                label="Mã nhóm"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập mã nhóm!',
                  },
                ]}
                tooltip="Mã nhóm phải là duy nhất"
              >
                <Input autoFocus placeholder="Nhập mã nhóm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên nhóm"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập tên nhóm!',
                  },
                ]}
              >
                <Input placeholder="Nhập tên nhóm" />
              </Form.Item>
            </Col>
          </Row>{' '}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Hạng mục"
                name="hang_muc_id"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải chọn hạng mục!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn hạng mục"
                  options={categories.map((c) => ({ label: c.name, value: c.id }))}
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
