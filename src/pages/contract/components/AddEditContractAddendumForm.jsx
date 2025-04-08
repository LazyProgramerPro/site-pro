import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Spin,
  notification,
  Upload,
} from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import { useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const initialState = {

};



export default function AddEditContractAddendumForm(props) {
  const navigate = useNavigate();
  const { onClose, open } = props;
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(initialState);

  const loading = useSelector((state) => state.contractAddendum.loading);

  const selectedContractAddendum = useSelector(
    (state) => state.contractAddendum.editingContractAddendum
  );
  console.log("editingContractAddendum:", selectedContractAddendum);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInitialValues(selectedContractAddendum || initialState);
  }, [selectedContractAddendum]);

  const onFinish = async (values) => {
    try {
      if (!selectedContractAddendum) {
        // dispatch(createContractAddendum(values));

        notification.success({
          message: "Success",
          description: "Add contract addendum successfully",
        });
      } else {
        // dispatch(updateContractAddendum({ ...values, id: selectedContractAddendum }));

        notification.success({
          message: "Success",
          description: "Update contract addendum successfully",
        });
      }

      onClose();

      navigate("/dashboard/administration/contract-addendum");
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
      width={720}
      title={
        isEmpty(selectedContractAddendum)
          ? "Thêm mới phụ lục hợp đồng"
          : `Sửa phụ lục hợp đồng ${initialValues && initialValues?.code}`
      }
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContractAddendum) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-add-edit-contract-addendum"
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
                label="Mã phụ lục hợp đồng"
                name="code"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập mã phụ lục hợp đồng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên phụ lục hợp đồng"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập tên phụ lục hợp đồng!",
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
                    message: "Bạn phải chọn tên dự án!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn dự án">
                  {["Dự án A", "Dự án B", "Dự án C", "Dự án D", "Dự án E"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
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
                    message: "Bạn phải chọn tên công trình!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn công trình"
                >
                  {["Công trình 1", "Công trình 2", "Công trình 3", "Công trình 4", "Công trình 5"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên hợp đồng"
                name="contractName"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải chọn tên hợp đồng!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn hợp đồng">
                  {["Hợp đồng A-001", "Hợp đồng B-002", "Hợp đồng C-003", "Hợp đồng D-004", "Hợp đồng E-005"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Hạng mục"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải chọn hạng mục!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn hạng mục"
                >
                  {["Hạng mục 1", "Hạng mục 2", "Hạng mục 3", "Hạng mục 4", "Hạng mục 5"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Nhóm"
                name="group"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải chọn nhóm!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn nhóm">
                  {["Nhóm A", "Nhóm B", "Nhóm C", "Nhóm D", "Nhóm E"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Đơn vị"
                name="unit"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập đơn vị!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Khối lượng"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập khối lượng!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Đơn giá"
                name="unitPrice"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập đơn giá!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Thành tiền"
                name="totalAmount"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải nhập thành tiền!",
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
                label="Nhà thầu thi công"
                name="contractor"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải chọn nhà thầu thi công!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn nhà thầu thi công">
                  {["Công ty xây dựng A", "Công ty xây dựng B", "Công ty xây dựng C", "Công ty xây dựng D", "Công ty xây dựng E"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tư vấn giám sát"
                name="supervisionConsultant"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải chọn tư vấn giám sát!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn tư vấn giám sát"
                >
                  {["Tư vấn giám sát A", "Tư vấn giám sát B", "Tư vấn giám sát C", "Tư vấn giám sát D", "Tư vấn giám sát E"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tư vấn thiết kế"
                name="designConsultant"
                rules={[
                  {
                    required: true,
                    message: "Bạn phải chọn tư vấn thiết kế!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn tư vấn thiết kế"
                >
                  {["Tư vấn thiết kế A", "Tư vấn thiết kế B", "Tư vấn thiết kế C", "Tư vấn thiết kế D", "Tư vấn thiết kế E"].map(
                    (b, index) => {
                      return (
                        <Select.Option value={b} key={index}>
                          {b}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedContractAddendum) ? "Thêm phụ lục" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
