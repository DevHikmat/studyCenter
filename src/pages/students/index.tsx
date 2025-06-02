import React, { useState } from "react"
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
} from "antd"
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import styles from "./students.module.css"

const { Option } = Select
const { Search } = Input

interface Student {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: "male" | "female"
  dateOfBirth: string
  roleIds?: number[]
  courseIds?: number[]
  groupIds?: number[]
  cardId?: string
  status: "active" | "inactive"
}

const StudentsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchText, setSearchText] = useState("")
  const [form] = Form.useForm()

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      username: "john.doe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@school.com",
      phone: "+1-234-567-8901",
      gender: "male",
      dateOfBirth: "2005-03-15",
      courseIds: [1, 2],
      groupIds: [1],
      cardId: "STU001",
      status: "active",
    },
    {
      id: 2,
      username: "jane.smith",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@school.com",
      phone: "+1-234-567-8902",
      gender: "female",
      dateOfBirth: "2005-07-22",
      courseIds: [1, 3],
      groupIds: [1],
      cardId: "STU002",
      status: "active",
    },
    {
      id: 3,
      username: "robert.johnson",
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.johnson@school.com",
      phone: "+1-234-567-8903",
      gender: "male",
      dateOfBirth: "2004-11-08",
      courseIds: [2, 3],
      groupIds: [2],
      cardId: "STU003",
      status: "inactive",
    },
    {
      id: 4,
      username: "emily.davis",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@school.com",
      phone: "+1-234-567-8904",
      gender: "female",
      dateOfBirth: "2005-01-30",
      courseIds: [1, 2, 3],
      groupIds: [1],
      cardId: "STU004",
      status: "active",
    },
  ])

  const handleAddEdit = () => {
    form
      .validateFields()
      .then((values) => {
        const studentData: Student = {
          ...values,
          dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
          id: editingStudent ? editingStudent.id : Date.now(),
        }

        if (editingStudent) {
          setStudents((prev) =>
            prev.map((s) => (s.id === editingStudent.id ? studentData : s)),
          )
        } else {
          setStudents((prev) => [...prev, studentData])
        }

        setIsModalVisible(false)
        setEditingStudent(null)
        form.resetFields()
      })
      .catch((info) => {
        // Validation failed, do nothing
        console.log("Validate Failed:", info)
      })
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    form.setFieldsValue({
      ...student,
      dateOfBirth: dayjs(student.dateOfBirth),
    })
    setIsModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      content: "This action cannot be undone.",
      onOk: () => {
        setStudents((prev) => prev.filter((s) => s.id !== id))
      },
    })
  }

  const filteredStudents = students.filter((student) => {
    const lowerSearch = searchText.toLowerCase()
    return (
      student.firstName.toLowerCase().includes(lowerSearch) ||
      student.lastName.toLowerCase().includes(lowerSearch) ||
      student.email.toLowerCase().includes(lowerSearch) ||
      student.username.toLowerCase().includes(lowerSearch)
    )
  })

  const columns = [
    {
      title: "Card ID",
      dataIndex: "cardId",
      key: "cardId",
      width: 100,
      render: (cardId: string) => (cardId ? <Tag color="blue">{cardId}</Tag> : "-"),
    },
    {
      title: "Name",
      key: "name",
      render: (_: any, student: Student) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {student.firstName} {student.lastName}
          </div>
          <div style={{ fontSize: 12, color: "#8c8c8c" }}>@{student.username}</div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => gender.charAt(0).toUpperCase() + gender.slice(1),
    },
    {
      title: "Age",
      dataIndex: "dateOfBirth",
      key: "age",
      render: (dateOfBirth: string) => dayjs().diff(dayjs(dateOfBirth), "year"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, student: Student) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(student)} />
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
  ]

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
                setEditingStudent(null)
                form.resetFields()
                setIsModalVisible(true)
              }}
            >
              Add Student
            </Button>
            <Button icon={<ExportOutlined />}>Export to Excel</Button>
          </Space>
        </div>

        <div className={styles.searchContainer}>
          <Search
            placeholder="Search students by name, email, or username..."
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
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
          }}
        />
      </Card>

      <Modal
        title={editingStudent ? "Edit Student" : "Add New Student"}
        open={isModalVisible}
        onOk={handleAddEdit}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingStudent(null)
          form.resetFields()
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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

            <Form.Item name="cardId" label="Card ID">
              <Input placeholder="e.g., STU001" />
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
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select date of birth" }]}
            >
              <DatePicker style={{ width: "100%" }} />
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
  )
}

export default StudentsPage
