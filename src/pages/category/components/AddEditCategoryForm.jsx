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

export default function AddEditCategoryForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.category.loading);

  const selectedCategory = useSelector(
    (state) => state.category.editingCategory
  );
  console.log("editingCategory:", selectedCategory);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedCategory || initialState);
  }, [selectedCategory]);

  const onFinish = async (values) => {
    try {
      if (!selectedCategory) {
        // dispatch(createCategory(values));

        notification.success({
          message: "Success",
          description: "Add category successfully",
        });
      } else {
        // dispatch(updateCategory({ ...values, id: selectedCategory }));

        notification.success({
          message: "Success",
          description: "Update category successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/category");
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
        isEmpty(selectedCategory)
          ? "Thêm mới hạng mục"
          : `Sửa hạng mục ${initialValues && initialValues?.name}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedCategory) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-category"
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
                label="Mã hạng mục"
                name="userName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã hạng mục!",
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
                label="Tên hạng mục"
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

          <Row gutter={16}>
            <Col span={24}>
              {" "}
              <Form.Item
                label="Công trình"
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

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedCategory) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
