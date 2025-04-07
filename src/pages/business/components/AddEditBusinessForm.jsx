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

const initialState = {};

export default function AddEditBusinessForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.business.loading);

  const selectedBusiness = useSelector(
    (state) => state.business.editingBusiness
  );

  useEffect(() => {
    setInitialValues(selectedBusiness || initialState);
  }, [selectedBusiness]);

  const onFinish = async (values) => {
    try {
      if (!selectedBusiness) {
        // dispatch(createBusiness(values));

        notification.success({
          message: "Success",
          description: "Add business successfully",
        });
      } else {
        // dispatch(updateBusiness({ ...values, id: selectedBusiness }));

        notification.success({
          message: "Success",
          description: "Update business successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/business");
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
        isEmpty(selectedBusiness)
          ? "Thêm mới doanh nghiệp"
          : `Sửa doanh nghiệp ${initialValues && initialValues?.businessCode}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedBusiness) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-business"
          form={form}
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label="Mã doanh nghiệp"
                name="businessCode"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã doanh nghiệp!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                label="Tên doanh nghiệp"
                name="businessName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên doanh nghiệp!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedBusiness)
                ? "Thêm doanh nghiệp"
                : "Cập nhật doanh nghiệp"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
