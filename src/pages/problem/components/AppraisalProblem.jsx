import { Button, Col, Form, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

export default function AppraisalProblem() {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <Form
        name="form-add-edit-project"
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Ghi chú"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Bạn phải nhập mã dự án!",
                },
              ]}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Đã giải quyết
          </Button>
          <Button type="dashed">Từ chối</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
