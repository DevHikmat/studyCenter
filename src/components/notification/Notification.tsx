import { useEffect, useRef } from "react";
import api from "../../services/api";
import { message } from "antd";

export interface AttendanceItem {
  day: number;
  date: string | null;
  status: "PRESENT" | "ABSENT";
}
export interface Student {
  id: number;
  name: string;
}
export interface AttendanceRecord {
  student: Student;
  items: AttendanceItem[];
}

const Notification = () => {
  const targetStudentRef = useRef(null);

  const getLastPresentStudent = (attendanceList: AttendanceRecord[]) => {
    let latestDate: any = null;
    let latestStudent: any = null;

    attendanceList.forEach(({ student, items }) => {
      items.forEach(({ date, status }) => {
        if (date && status === "PRESENT") {
          const currentDate = new Date(date);
          console.log(currentDate, new Date())
          if (!latestDate || (currentDate > latestDate && (currentDate.getDate() <= new Date().getDate()-1))) {
            latestDate = currentDate;
            latestStudent = student;
          }
        }
      });
    });

    return { latestStudent, latestDate };
  };

  const handleGetAttendence = async () => {
    try {
      const response = await api.get(
        "http://185.74.5.42:8081/api/attendance?month=6&year=2025"
      );
      const result = getLastPresentStudent(response.data);
      const findStudent = { date: result.latestDate, ...result.latestStudent };
      const prevStudent:any = targetStudentRef?.current;
      if (!prevStudent && findStudent) {
        // message.success(`${findStudent.name} - yetib keldi.`);
      } else if (
        findStudent &&
        prevStudent &&
        String(findStudent.date) !== String(prevStudent.date)
      ) {
        message.success(`${findStudent.name} - talaba keldi.`);
      }
      targetStudentRef.current = findStudent;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAttendence(); 
    const interval = setInterval(() => {
      handleGetAttendence();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return <div></div>;
};

export default Notification;
