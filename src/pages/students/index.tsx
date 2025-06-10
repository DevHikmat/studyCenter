import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  Card,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./students.module.css";
import type { Student } from "../../types";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "../../services/studentService";
import "dayjs/locale/uz";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { studentChanged } from "../../store/studentSlice";
import { Link } from "react-router-dom";

dayjs.locale("uz");

const { Option } = Select;
const { Search } = Input;

const StudentsPage: React.FC = () => {
  const { studentList: students } = useSelector(
    (state: RootState) => state.students
  );
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  const handleSaveChanges = async (id: number, student: Partial<Student>) => {
    try {
      await updateStudent(id, student);
      message.success("Student ma'lumotlari o'zgartrildi.");
      dispatch(studentChanged());
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStudent = async (student: Partial<Student>) => {
    try {
      await addStudent(student);
      message.success("Student muvoffaqiyatli qo'shildi.");
      dispatch(studentChanged());
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.warning("Student qo'shishda xatolik yuz berdi.");
    }
  };

  const handleAddEdit = async () => {
    form
      .validateFields()
      .then((values) => {
        const studentData = {
          ...values,
          gender: values.gender?.toUpperCase(),
        };
        studentData.dateOfBirth = values.dateOfBirth?.format("YYYY-MM-DD");

        if (editingStudent && editingStudent.id) {
          handleSaveChanges(editingStudent.id, studentData);
        } else {
          handleAddStudent(studentData);
        }
        setIsModalVisible(false);
        setEditingStudent(null);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDelete = (id: number | undefined) => {
    if (!id) return message.warning("Bunday id li student topilmadi.");
    Modal.confirm({
      title: "Rostdan ham ushbu student o'chsinmi ?",
      content: "Bu jarayonni ortga qaytarib bo'lmaydi.",
      okText: "Ha",
      okType: "danger",
      cancelText: "Bekor qilish",
      onOk: async () => {
        try {
          await deleteStudent(id);
          message.success("Student muvoffaqiyatli o'chirildi.");
          dispatch(studentChanged());
        } catch (error) {
          message.warning("O'chirishda xatolik yuz berdi.");
          console.log(error);
        }
      },
    });
  };

  const filteredStudents = students.filter((student) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      student.firstName?.toLowerCase().includes(lowerSearch) ||
      student.lastName?.toLowerCase().includes(lowerSearch) ||
      student.email?.toLowerCase().includes(lowerSearch)
    );
  });

  const columns = [
    {
      title: "№",
      render: (_: any, __: any, index: number) => (
        <Tag color="blue">{index + 1}</Tag>
      )      
    },
    {
      title: "Ism",
      dataIndex: "firstName",
      key: "firstname",
    },
    {
      title: "Familya",
      dataIndex: "lastName",
      key: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Qo'shildi",
      key: "email",
      render: (record: Partial<Student>) => {
        return (
          <span>
            {dayjs(record.createdDate?.slice(0, 23)).format("D-MMMM. YYYY")}
          </span>
        );
      },
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, student: Partial<Student>) => (
        <Space>
          <Tooltip title="View">
            <Link to={`/students/${student.id}`}>
              <Button type="text" icon={<FileSearchOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(student.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.studentsPage}>
      <Card>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Students Management</h1>
          <Space>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setEditingStudent(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              Add Student
            </Button>
            <Button icon={<ExportOutlined />}>Export to Excel</Button>
          </Space>
        </div>

        <div className={styles.searchContainer}>
          <Search
            placeholder="Qidirish ism, familya yoki email orqali"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} students`,
          }}
        />
      </Card>

      <Modal
        title={editingStudent ? "Update Student Info" : "Add New Student"}
        open={isModalVisible}
        onOk={handleAddEdit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        width={800}
        okText={editingStudent ? "Update" : "Add"}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "active", gender: "male" }}
          preserve={false}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="password" label="Password">
              <Input placeholder="enter password" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Please select gender" }]}
            >
              <Select>
                <Option value="MALE">Male</Option>
                <Option value="FEMALE">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="cardId" label="Card ID">
              <Input placeholder="e.g., STU001" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
