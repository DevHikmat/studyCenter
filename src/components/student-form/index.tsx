import React, { useEffect } from "react";
import { Form, Input, Select, Button } from "antd";
import styles from "./student-form.module.css";

const { Option } = Select;

interface StudentFormProps {
  onSubmit: (student: StudentFormData) => void;
  onCancel: () => void;
  initialData?: StudentFormData;
}

export interface StudentFormData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string; // ISO date string
  roleIds?: number[];
  courseIds?: number[];
  groupIds?: number[];
  cardId?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [form] = Form.useForm<StudentFormData>();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFinish = (values: StudentFormData) => {
    onSubmit(values);
  };

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>{initialData ? "Edit Student" : "Add New Student"}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={styles.form}
        initialValues={{ gender: "MALE" }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input username" }]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: !initialData, message: "Please input password" }]}
        >
          <Input.Password className={styles.input} />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input first name" }]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input last name" }]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please input phone number" }]}
        >
          <Input className={styles.input} />
        </Form.Item>

        <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
          <Select className={styles.select}>
            <Option value="MALE">Male</Option>
            <Option value="FEMALE">Female</Option>
            <Option value="OTHER">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[{ required: true, message: "Please input date of birth" }]}
        >
          <Input type="date" className={styles.input} />
        </Form.Item>

        {/* Qo'shimcha maydonlar roleIds, courseIds, groupIds, cardId siz xohlagancha qo'shishingiz mumkin */}

        <Form.Item className={styles.formActions}>
          <Button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" className={styles.submitButton}>
            {initialData ? "Update Student" : "Add Student"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StudentForm;
