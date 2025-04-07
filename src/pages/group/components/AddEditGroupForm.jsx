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

export default function AddEditGroupForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.group.loading);

  const selectedGroup = useSelector((state) => state.group.editingGroup);
  console.log("editingGroup:", selectedGroup);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedGroup || initialState);
  }, [selectedGroup]);

  const onFinish = async (values) => {
    try {
      if (!selectedGroup) {
        // dispatch(createGroup(values));

        notification.success({
          message: "Success",
          description: "Add group successfully",
        });
      } else {
        // dispatch(updateGroup({ ...values, id: selectedGroup }));

        notification.success({
          message: "Success",
          description: "Update group successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/group");
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
        isEmpty(selectedGroup)
          ? "Thêm mới nhóm"
          : `Sửa nhóm ${initialValues && initialValues?.name}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedGroup) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-group"
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
                label="Mã nhóm"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã nhóm!",
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
                label="Tên nhóm"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên nhóm!",
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
                label="Hạng mục"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên hạng mục!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedGroup) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
