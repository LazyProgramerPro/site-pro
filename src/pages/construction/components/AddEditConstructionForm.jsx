import { CloseCircleOutlined, SaveOutlined, HomeOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Drawer, Form, Input, Row, Select, Space, Spin, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { addConstruction, updateConstruction, getConstructionList } from '../redux/construction.slice';
import { getProjectList } from '../../project/redux/project.slice';

const initialState = {
  code: '',
  name: '',
  du_an_id: '',
};

export default function AddEditConstructionForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);
  const [projects, setProjects] = useState([]);

  const loading = useSelector((state) => state.construction.loading);

  const selectedConstruction = useSelector((state) => state.construction.editingConstruction);
  console.log('editingConstruction:', selectedConstruction);
  const dispatch = useAppDispatch();

  const projectList = useSelector((state) => state.project.projectList);

  useEffect(() => {
    // Lấy danh sách dự án khi mở form
    dispatch(getProjectList({ pageNo: 0, pageSize: 100, searchText: '' }));
  }, [dispatch]);

  useEffect(() => {
    setProjects(projectList || []);
  }, [projectList]);

  useEffect(() => {
    if (selectedConstruction) {
      setInitialValues({
        code: selectedConstruction.code || '',
        name: selectedConstruction.name || '',
        du_an_id: selectedConstruction.du_an_id || '',
      });
    } else {
      setInitialValues(initialState);
    }
  }, [selectedConstruction]);

  const onFinish = async (values) => {
    try {
      if (!selectedConstruction) {
        const payload = {
          code: values.code,
          name: values.name,
          du_an_id: values.du_an_id,
        };

        try {
          await dispatch(addConstruction(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Thêm công trình thành công',
          });

          // get new construction list

          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          await dispatch(getConstructionList(filters));

          onClose();
          navigate('/dashboard/administration/construction');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi thêm công trình',
          });
          return;
        }
      } else {
        // Format dates for API
        const payload = {
          id: selectedConstruction.id,
          code: values.code,
          name: values.name,
          du_an_id: values.du_an_id,
        };
        try {
          await dispatch(updateConstruction(payload)).unwrap();

          notification.success({
            message: 'Thành công',
            description: 'Cập nhật công trình thành công',
          });
          // get new construction list
          const filters = {
            pageNo: 0,
            pageSize: 10,
            searchText: '',
          };
          await dispatch(getConstructionList(filters));
          onClose();
          navigate('/dashboard/administration/construction');
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: error?.message || 'Đã xảy ra lỗi khi cập nhật công trình',
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
            icon={<HomeOutlined />}
            style={{ backgroundColor: isEmpty(selectedConstruction) ? '#1890ff' : '#52c41a' }}
          />
          <span>
            {isEmpty(selectedConstruction)
              ? 'Thêm mới công trình'
              : `Sửa công trình ${initialValues && initialValues?.code}`}
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
            {isEmpty(selectedConstruction) ? 'Thêm công trình' : 'Cập nhật'}
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 24 }}
    >
      {!isEmpty(selectedConstruction) && isEmpty(initialValues) ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" tip="Đang tải thông tin công trình..." />
        </div>
      ) : (
        <Form
          name="form-add-edit-construction"
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
                label="Mã công trình"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập mã công trình!',
                  },
                ]}
                tooltip="Mã công trình phải là duy nhất"
              >
                <Input autoFocus placeholder="Nhập mã công trình" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên công trình"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải nhập tên công trình!',
                  },
                ]}
              >
                <Input placeholder="Nhập tên công trình" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Dự án"
                name="du_an_id"
                rules={[
                  {
                    required: true,
                    message: 'Bạn phải chọn dự án!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn dự án"
                  options={projects.map((p) => ({ label: p.name, value: p.id }))}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                />
              </Form.Item>
            </Col>
          </Row>
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
