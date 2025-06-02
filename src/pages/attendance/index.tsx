import { useState, useEffect } from "react";
import {
  Table,
  Button,
  DatePicker,
  Modal,
  Tag,
  Space,
  Card,
  Statistic,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./attendance.module.css";

interface Student {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  dateOfBirth: string;
  roleIds?: number[];
  courseIds?: number[];
  groupIds?: number[];
  cardId?: string;
  status: "active" | "inactive"
}

interface AttendanceRecord {
  studentId: number;
  date: string;
  status: "present" | "absent" | "late";
  remarks?: string;
}

export default function AttendancePage() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  // Sample students data
  const [students] = useState<Student[]>([
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
  ]);

  // Generate attendance data when currentMonth changes
  useEffect(() => {
    generateAttendanceData();
  }, [currentMonth]);

  const generateAttendanceData = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const daysInMonth = endOfMonth.date();

    const newAttendanceData: AttendanceRecord[] = [];

    students.forEach((student) => {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = startOfMonth.date(day);
        if (date.day() !== 0 && date.day() !== 6) {
          const random = Math.random();
          let status: "present" | "absent" | "late";
          if (random > 0.9) {
            status = "absent";
          } else if (random > 0.8) {
            status = "late";
          } else {
            status = "present";
          }

          newAttendanceData.push({
            studentId: student.id,
            date: date.format("YYYY-MM-DD"),
            status,
            remarks:
              status === "absent"
                ? "Sick leave"
                : status === "late"
                ? "Traffic delay"
                : undefined,
          });
        }
      }
    });

    setAttendanceData(newAttendanceData);
  };

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const days = [];

    for (
      let day = startOfMonth;
      day.isBefore(endOfMonth) || day.isSame(endOfMonth);
      day = day.add(1, "day")
    ) {
      if (day.day() !== 0 && day.day() !== 6) {
        days.push(day);
      }
    }

    return days;
  };

  const getAttendanceStatus = (studentId: number, date: string) => {
    const record = attendanceData.find(
      (record) => record.studentId === studentId && record.date === date
    );
    return record?.status || "absent";
  };

  const updateAttendanceStatus = (
    studentId: number,
    date: string,
    status: "present" | "absent" | "late"
  ) => {
    setAttendanceData((prev) => {
      const existingIndex = prev.findIndex(
        (record) => record.studentId === studentId && record.date === date
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      } else {
        return [...prev, { studentId, date, status }];
      }
    });
  };

  const getAttendanceTag = (status: "present" | "late" | "absent") => {
    const config = {
      present: { color: "success", text: "P" },
      late: { color: "warning", text: "L" },
      absent: { color: "error", text: "A" },
    };

    const { color, text } = config[status] || { color: "default", text: "A" };

    return (
      <Tag
        color={color}
        style={{ minWidth: "24px", textAlign: "center", cursor: "pointer" }}
      >
        {text}
      </Tag>
    );
  };

  const showStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const getMonthlyStats = () => {
    const totalDays = getDaysInMonth().length;
    const totalRecords = students.length * totalDays;

    const presentCount = attendanceData.filter(
      (record) => record.status === "present"
    ).length;
    const lateCount = attendanceData.filter(
      (record) => record.status === "late"
    ).length;
    const absentCount = attendanceData.filter(
      (record) => record.status === "absent"
    ).length;

    const presentPercentage =
      totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : "0";
    const latePercentage =
      totalRecords > 0 ? ((lateCount / totalRecords) * 100).toFixed(1) : "0";
    const absentPercentage =
      totalRecords > 0 ? ((absentCount / totalRecords) * 100).toFixed(1) : "0";

    return {
      totalDays,
      totalStudents: students.length,
      presentCount,
      lateCount,
      absentCount,
      presentPercentage,
      latePercentage,
      absentPercentage,
    };
  };

  const days = getDaysInMonth();
  const stats = getMonthlyStats();

  // Table columns including student info, attendance per day, and summary
  const columns = [
    {
      title: "Student",
      key: "student",
      fixed: "left" as const,
      width: 200,
      render: (student: Student) => (
        <div className={styles.studentCell}>
          <div className={styles.studentName}>
            <Button
              type="link"
              onClick={() => showStudentDetails(student)}
              style={{ padding: 0, height: "auto" }}
            >
              {student.firstName} {student.lastName}
            </Button>
          </div>
          <div className={styles.studentInfo}>
            {student.cardId && (
              <span className={styles.cardId}>{student.cardId}</span>
            )}
            <span className={styles.username}>@{student.username}</span>
          </div>
        </div>
      ),
    },
    ...days.map((day) => ({
      title: (
        <div className={styles.dayHeader}>
          <div>{day.format("DD")}</div>
          <div className={styles.dayName}>{day.format("ddd")}</div>
        </div>
      ),
      key: day.format("YYYY-MM-DD"),
      width: 60,
      align: "center" as const,
      render: (student: Student) => {
        const date = day.format("YYYY-MM-DD");
        const status = getAttendanceStatus(student.id, date);

        return (
          <Tooltip
            title={`${day.format("MMM DD, YYYY")} - ${
              status.charAt(0).toUpperCase() + status.slice(1)
            }`}
          >
            <div
              onClick={() => {
                const newStatus =
                  status === "present"
                    ? "absent"
                    : status === "absent"
                    ? "late"
                    : "present";
                updateAttendanceStatus(student.id, date, newStatus);
              }}
              style={{ cursor: "pointer" }}
            >
              {getAttendanceTag(status)}
            </div>
          </Tooltip>
        );
      },
    })),
    {
      title: "Summary",
      key: "summary",
      fixed: "right" as const,
      width: 100,
      render: (student: Student) => {
        const studentRecords = attendanceData.filter(
          (record) => record.studentId === student.id
        );
        const present = studentRecords.filter(
          (record) => record.status === "present"
        ).length;
        const late = studentRecords.filter(
          (record) => record.status === "late"
        ).length;
        const absent = studentRecords.filter(
          (record) => record.status === "absent"
        ).length;
        const total = days.length;
        const percentage =
          total > 0 ? (((present + late) / total) * 100).toFixed(0) : "0";

        return (
          <div className={styles.summaryCell}>
            <div className={styles.attendanceRate}>{percentage}%</div>
            <div className={styles.attendanceCounts}>
              <span className={styles.presentCount}>P:{present}</span>
              <span className={styles.lateCount}>L:{late}</span>
              <span className={styles.absentCount}>A:{absent}</span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.attendancePage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <CalendarOutlined /> Monthly Attendance
        </h1>
        <Space>
          <DatePicker
            picker="month"
            value={currentMonth}
            onChange={(date) => date && setCurrentMonth(date)}
            format="MMMM YYYY"
          />
          <Button onClick={generateAttendanceData}>Refresh Data</Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} className={styles.statsRow}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Present"
              value={`${stats.presentPercentage}%`}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              suffix={`(${stats.presentCount})`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Late"
              value={`${stats.latePercentage}%`}
              prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
              suffix={`(${stats.lateCount})`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Absent"
              value={`${stats.absentPercentage}%`}
              prefix={<CloseCircleOutlined style={{ color: "#f5222d" }} />}
              suffix={`(${stats.absentCount})`}
            />
          </Card>
        </Col>
      </Row>

      <Table
        className={styles.attendanceTable}
        dataSource={students}
        columns={columns}
        pagination={false}
        rowKey="id"
        scroll={{ x: "max-content" }}
      />

      {/* Student Detail Modal */}
      <Modal
        title="Student Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={400}
      >
        {selectedStudent && (
          <div className={styles.studentDetails}>
            <p>
              <b>Name:</b> {selectedStudent.firstName}{" "}
              {selectedStudent.lastName}
            </p>
            <p>
              <b>Username:</b> @{selectedStudent.username}
            </p>
            <p>
              <b>Email:</b> {selectedStudent.email}
            </p>
            <p>
              <b>Phone:</b> {selectedStudent.phone}
            </p>
            <p>
              <b>Gender:</b> {selectedStudent.gender}
            </p>
            <p>
              <b>Date of Birth:</b>{" "}
              {dayjs(selectedStudent.dateOfBirth).format("DD MMM YYYY")}
            </p>
            {selectedStudent.cardId && (
              <p>
                <b>Card ID:</b> {selectedStudent.cardId}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
