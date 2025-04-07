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
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { useSelector } from "react-redux";

const initialState = {
  userName: "",
  fullName: "",
  password: "",
  confirmPassword: "",
  email: "",
  phoneNumber: "",
  role: "",
  company: "",
  position: "",
};

export default function AddEditConstructionForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.construction.loading);

  const selectedConstruction = useSelector(
    (state) => state.construction.editingConstruction
  );
  console.log("editingConstruction:", selectedConstruction);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedConstruction || initialState);
  }, [selectedConstruction]);

  const onFinish = async (values) => {
    try {
      if (!selectedConstruction) {
        // dispatch(createConstruction(values));

        notification.success({
          message: "Success",
          description: "Add construction successfully",
        });
      } else {
        // dispatch(updateConstruction({ ...values, id: selectedConstruction }));

        notification.success({
          message: "Success",
          description: "Update construction successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/construction");
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    notification.error({
      message: "Errors",
      description: errorInfo.message,
    });
  };
  return (
    <Drawer
      width={500}
      title={
        isEmpty(selectedConstruction)
          ? "Thêm mới công trình"
          : `Sửa công trình ${initialValues && initialValues?.name}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedConstruction) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-construction"
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
                label="Mã công trình"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã công trình!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              {" "}
              <Form.Item
                label=" Tên công trình"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên công trình!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              {" "}
              <Form.Item
                label="Dự án"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên dự án!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedConstruction) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
