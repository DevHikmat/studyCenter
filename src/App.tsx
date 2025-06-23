import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import StudentsPage from "./pages/students";
import AttendancePage from "./pages/attendance";
import PaymentsPage from "./pages/payments";
import ProtectedRoute from "./routes/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { initializeAuth } from "./store/authSlice";
import type { RootState } from "./store";
import { getAllStudents } from "./services/studentService";
import { setStudentToStore } from "./store/studentSlice";
import StudentDetail from "./pages/studentDetail/StudentDetail";
import Notification from "./components/notification/Notification";

function App() {
  const { isChange } = useSelector((state:RootState) => state.students);
  const dispatch = useDispatch();


  const handleGetStudents = async () => {
    try {
      const data = await getAllStudents();
      dispatch(setStudentToStore(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetStudents();
  }, [isChange]);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Notification />
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Redirect all unknown routes to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
