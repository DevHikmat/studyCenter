import { useDispatch } from "react-redux";
import { Form, Input, Button, Card, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/authSlice";
import { login } from "../../services/authService";

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: LoginForm) => {
    try {
      const { token } = await login(values);
      dispatch(loginSuccess({ token: token, username: values.username }));
      if (values.rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }
      message.success("Welcome!");
      navigate("/dashboard");
    } catch (error) {
      message.error("Server error");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard} title="Student Management System">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username (admin)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password (admin)"
              size="large"
            />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Log in
            </Button>
          </Form.Item>
        </Form>

        <div className={styles.loginHint}>
          <p>
            Forgot password ? <Link to="/">Click here!</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
