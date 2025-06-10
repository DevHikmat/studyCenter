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
  Flex,
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
      message.success("Talaba muvoffaqiyatli o'zgartrildi");
      setLoadingEdit(false);
      setIsEditModalOpen(false);
    } catch (error) {
      message.error("Talabani o'zgartrishda xatolik.");
      setLoadingEdit(false);
      console.log(error);
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
            <Title level={4} style={{ marginBottom: 4 }}>
              {student.firstName} {student.lastName}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              <Flex gap={10}>
                Foydalanuvchi nomi: <h5>{student.username}</h5>
              </Flex>
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
                O'zgartrish
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
                  O'chirish
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
                <PhoneOutlined /> Telefon
              </Text>
              <Text>{student.phone}</Text>
            </Space>
          </Col>

          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <CalendarOutlined /> Tug'ilgan kun
              </Text>
              <Text>{student.dateOfBirth}</Text>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Text strong>
                <UserAddOutlined /> Jins
              </Text>
              <Text>{student.gender == "MALE" ? "Erkak" : "Ayol"}</Text>
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
                <TeamOutlined /> Ro'yxatga oldi
              </Text>
              <Text>
                {student.createdBy?.name} (ID: {student.createdBy?.id})
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
      <Modal
        title="Talabani o'zgartrish"
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
            label="Ism"
            name="firstName"
            rules={[{ required: true, message: "Iltimos, ismingizni kiriting" }]}
          >
            <Input placeholder="Ismingiz" />
          </Form.Item>

          <Form.Item
            label="Familya"
            name="lastName"
            rules={[{ required: true, message: "Iltimos, familiyani kiriting" }]}
          >
            <Input placeholder="Familya" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Iltimos, elektron pochta manzilini kiriting" },
              { type: "email", message: "Yaroqli elektron pochta manzilini kiriting" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Telefon raqami"
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
            label="Tug'ilgan sana"
            name="dateOfBirth"
            rules={[{ required: true, message: "Iltimos, tug'ilgan sanani tanlang" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Foydalanuvchi nomi(Username)"
            name="username"
            rules={[{ required: true, message: "Please input username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Jinsingiz"
            name="gender"
            rules={[{ required: true, message: "Jinsni tanlang" }]}
          >
            <Select placeholder="Jinsni tanlang">
              <Option value="MALE">Erkak</Option>
              <Option value="FEMALE">Ayol</Option>
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
