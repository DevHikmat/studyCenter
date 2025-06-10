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
      title: "Harakatlar",
      key: "actions",
      render: (_: any, student: Partial<Student>) => (
        <Space>
          <Tooltip title="Ko'rish">
            <Link to={`/students/${student.id}`}>
              <Button type="text" icon={<FileSearchOutlined />} />
            </Link>
          </Tooltip>
          <Tooltip title="O'chirish">
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
          <h1 className={styles.pageTitle}>Talabalar boshqaruvi</h1>
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
              Talaba qo'shish
            </Button>
            <Button icon={<ExportOutlined />}>Excelga eksport qilish</Button>
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
        title={editingStudent ? "Talaba ma'lumotlarini yangilash" : "Yangi talaba qo'shish"}
        open={isModalVisible}
        onOk={handleAddEdit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        width={800}
        okText={editingStudent ? "O'zgartrish" : "Qo'shish"}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: "active", gender: "Erkak" }}
          preserve={false}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item
              name="firstName"
              label="Ism"
              rules={[{ required: true, message: "Iltimos, ismingizni kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Familya"
              rules={[{ required: true, message: "Iltimos, familiyani kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label="Foydalanuvchi nomi(Username)"
              rules={[{ required: true, message: "Foydalanuvchi nomini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="password" label="Parol">
              <Input placeholder="Parol kiriting." />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Iltimos email kiriting" },
                { type: "email", message: "Yaroqli elektron pochta manzilini kiriting" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Telefon"
              rules={[{ required: true, message: "Iltimos, telefon raqamini kiriting" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Jinsni tanlang"
              rules={[{ required: true, message: "Jinsni tanlang" }]}
            >
              <Select>
                <Option value="MALE">Erkak</Option>
                <Option value="FEMALE">Ayol</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Tug'ilgan kuni"
              rules={[
                { required: true, message: "Tug'ilgan kuningiz" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="cardId" label="Card ID">
              <Input placeholder="Card ID" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Holati(Status)"
              rules={[{ required: true, message: "Statusni kiriting" }]}
            >
              <Select>
                <Option value="active">Faol</Option>
                <Option value="inactive">Nofaol</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
