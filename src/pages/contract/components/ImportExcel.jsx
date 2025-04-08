import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Form, Row, Select, Spin, Upload } from "antd";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";

const initialState = {

};

// Thêm code để xử lý việc upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function ImportExcel(props) {
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

  const onFinish = (values) => {};
  const onFinishFailed = (errorInfo) => {};

  // TODO: Xác nhận lại xem thêm cho hợp đồng
  return (
    <Drawer
      width={500}
      title={`Import Excel phụ lục hợp đồng`}
      placement="right"
      onClose={onClose}
      open={open}
    >
      {!isEmpty(selectedContractAddendum) && isEmpty(initialValues) ? (
        <Spin></Spin>
      ) : (
        <Form
          name="form-excel-contract-addendum"
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
                label="Tên dự án"
                name="projectName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên dự án!",
                  },
                ]}
              >
                <Select showSearch allowClear placeholder="Chọn tên dự án">
                  {["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"].map(
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
            <Col span={24}>
              <Form.Item
                label="Tên hợp đồng"
                name="contractName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên hợp đồng!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn tên hợp đồng"
                >
                  {["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"].map(
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
            <Col span={24}>
              <Form.Item
                label="Hình ảnh hợp đồng"
                name="contractImages"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: false,
                    message: "Vui lòng upload hình ảnh hợp đồng",
                  },
                ]}
              >
                <Upload.Dragger
                  name="contractImages"
                  listType="picture-card"
                  multiple
                  beforeUpload={() => false} // Ngăn upload tự động
                  accept="image/*"
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả hoặc nhấp để tải lên hình ảnh
                  </p>
                  <p className="ant-upload-hint">
                    Hỗ trợ tải lên nhiều file cùng lúc. Chỉ chấp nhận file ảnh
                    (JPG, PNG, GIF...)
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading}>
              {isEmpty(selectedContractAddendum) ? "Thêm" : "Cập nhật"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
