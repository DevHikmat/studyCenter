import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login";
import DashboardPage from "./pages/dashboard";
import StudentsPage from "./pages/students";
import AttendancePage from "./pages/attendance";
import PaymentsPage from "./pages/payments";
import ProtectedRoute from "./routes/ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { initializeAuth } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);
  return (
    <BrowserRouter>
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
