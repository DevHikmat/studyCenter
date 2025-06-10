import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Space,
  Popconfirm,
  Typography,
  Divider,
  Row,
  Col,
  message,
  Avatar,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import type { Student } from "../../types";
import {
  deleteStudent,
  getStudentById,
  updateStudent,
} from "../../services/studentService";
import { useDispatch } from "react-redux";
import { studentChanged } from "../../store/studentSlice";

const { Title, Text } = Typography;
const { Option } = Select;

const DetailStudentPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);

  const handleGetStudent = async () => {
    if (!id) return;
    try {
      const data = await getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetStudent();
  }, [id]);

  const [form] = Form.useForm();

  const openEditModal = () => {
    if (student) {
      form.setFieldsValue({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        dateOfBirth: dayjs(student.dateOfBirth),
        username: student.username,
        gender: student.gender,
        cardId: student.cardId,
      });
      setIsEditModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setLoadingDelete(true);
      await deleteStudent(id);
      dispatch(studentChanged());
      navigate("/students");
      message.success("Student deleted successfully");
      setLoadingDelete(false);
    } catch (error) {
      message.error("Failed to delete student");
      setLoadingDelete(false);
    }
  };

  const handleEditSubmit = async (values: any) => {
    if (!id) return;
    try {
      setLoadingEdit(true);
      const updatedStudent = {
        ...student,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        username: values.username,
        gender: values.gender,
        cardId: values.cardId,
      };

      await updateStudent(id, updatedStudent);
      message.success("Student updated successfully");
      setLoadingEdit(false);
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Failed to update student");
      setLoadingEdit(false);
      console.log(error)
    }
  };

  return student ? (
    <div>
      <Card
        style={{
          maxWidth: 700,
          margin: "40px 0",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
        bodyStyle={{ padding: "30px 40px" }}
      >
        <Row align="middle" gutter={16} style={{ marginBottom: 24 }}>
          <Col>
            <Avatar
              size={80}
              icon={<UserOutlined />}
              style={{ backgroundColor: "#7265e6" }}
            />
          </Col>
          <Col flex="auto">
            <Title level={2} style={{ marginBottom: 4 }}>
              {student.firstName} {student.lastName}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              @{student.username}
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="middle"
                onClick={openEditModal}
                shape="round"
              >
                Edit
              </Button>
              <Popconfirm
                title="Studentni o'chirishga ishonchingiz komilmi ?"
                onConfirm={handleDelete}
                okText="Ha"
                cancelText="Yo'q"
                okType="danger"
                okButtonProps={{ loading: loadingDelete }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="middle"
                  shape="round"
                  loading={loadingDelete}
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <MailOutlined /> Email
              </Text>
              <Text>{student.email}</Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <PhoneOutlined /> Phone
              </Text>
              <Text>{student.phone}</Text>
            </Space>
          </Col>

          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <CalendarOutlined /> Date of Birth
              </Text>
              <Text>{student.dateOfBirth}</Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <UserAddOutlined /> Gender
              </Text>
              <Text>{student.gender}</Text>
            </Space>
          </Col>

          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <IdcardOutlined /> Card ID
              </Text>
              <Text code>{student.cardId}</Text>
            </Space>
          </Col>

          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <TeamOutlined /> Created By
              </Text>
              <Text>
                {student.createdBy?.name} (ID: {student.createdBy?.id})
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
      <Modal
        title="Edit Student"
        open={isEditModalOpen}
        onCancel={closeEditModal}
        onOk={() => form.submit()}
        confirmLoading={loadingEdit}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{
            gender: student.gender,
            dateOfBirth: dayjs(student.dateOfBirth),
          }}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input first name" }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please input last name" }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input phone number" },
              {
                pattern: /^\+?\d{7,15}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input placeholder="Phone" />
          </Form.Item>

          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Please select date of birth" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select Gender">
              <Option value="MALE">Male</Option>
              <Option value="FEMALE">Female</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Card ID"
            name="cardId"
            rules={[{ required: true, message: "Please input card ID" }]}
          >
            <Input placeholder="Card ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  ) : (
    <h2>Loading...</h2>
  );
};

export default DetailStudentPage;
