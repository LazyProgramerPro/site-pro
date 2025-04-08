import { Button, Col, Drawer, Form, Input, Row, Select, Spin, notification, Upload } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import TextArea from 'antd/es/input/TextArea';
import { DeleteOutlined, EditOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';

const initialState = {};

// Thêm code để xử lý việc upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function AddEditConstructionDiaryForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.constructionDiary.loading);

  const selectedConstructionDiary = useSelector((state) => state.constructionDiary.editingConstructionDiary);
  console.log('editingConstructionDiary:', selectedConstructionDiary);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedConstructionDiary || initialState);
  }, [selectedConstructionDiary]);

  const onFinish = async (values) => {
    try {
      if (!selectedConstructionDiary) {
        // dispatch(createConstructionDiary(values));

        notification.success({
          message: 'Success',
          description: 'Add construction diary successfully',
        });
      } else {
        // dispatch(updateConstructionDiary({ ...values, id: selectedConstructionDiary }));

        notification.success({
          message: 'Success',
          description: 'Update construction diary successfully',
        });
      }

      onClose();

      navigate('/dashboard/administration/construction-diary');
    } catch (error) {
      console.log('error:', error);
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
      width={720}
      title={
        isEmpty(selectedConstructionDiary)
          ? 'Thêm mới nhật ký thi công'
          : `Sửa nhật ký thi công ${initialValues && initialValues?.diaryCode}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedConstructionDiary) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-construction-diary"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã nhật ký"
                name="diaryCode"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã nhật ký!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên nhật ký"
                name="diaryName"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên nhật ký!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên dự án"
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn tên dự án!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn tên dự án">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên công trình"
                name="constructionName"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn tên công trình!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn tên công trình">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Loại nhật ký"
                name="diaryType"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn loại nhật ký!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn loại nhật ký">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Thời tiết"
                name="weather"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn thời tiết!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn thời tiết">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Công tác vệ sinh môi trường"
                name="environmentalCleaning"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn công tác vệ sinh môi trường!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn công tác vệ sinh môi trường">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Công tác an toàn lao động"
                name="laborSafety"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn công tác an toàn lao động!',
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn công tác an toàn lao động">
                  {['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'].map((b, index) => {
                    return (
                      <Select.Option value={b} key={index}>
                        {b}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tình hình sử dụng phương tiện bảo hộ các nhân"
                name="protectiveEquipment"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tình hình sử dụng phương tiện bảo hộ cá nhân!',
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </Col>
          </Row>

          {/* Trường upload ảnh */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Hình ảnh nhật ký"
                name="diaryImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: 'Vui lòng upload hình ảnh nhật ký',
                  },
                ]}
              >
                <Upload.Dragger
                  name="diaryImages"
                  listType="picture-card"
                  multiple
                  beforeUpload={() => false} // Ngăn upload tự động
                  accept="image/*"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Kéo thả hoặc nhấp để tải lên hình ảnh</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chỉ chấp nhận file ảnh (JPG, PNG, GIF...)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>
          {/* Trường upload file */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tài liệu nhật ký"
                name="diaryDocuments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: 'Vui lòng upload tài liệu nhật ký',
                  },
                ]}
              >
                <Upload.Dragger
                  name="diaryDocuments"
                  multiple
                  beforeUpload={() => false} // Ngăn upload tự động
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Kéo thả hoặc nhấp để tải lên tài liệu</p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chấp nhận các định dạng: PDF, DOC, DOCX, XLS, XLSX, TXT
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedConstructionDiary) ? 'Thêm' : 'Cập nhật'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
