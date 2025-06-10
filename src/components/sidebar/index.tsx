// src/components/Sidebar.tsx
import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  PieChartOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, Link } from "react-router-dom";
import styles from "./sidebar.module.css";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

const { Sider } = Layout;

const menuItems = [
  { key: "/dashboard", label: "Dashboard", icon: <PieChartOutlined /> },
  { key: "/students", label: "Talabalar", icon: <UserOutlined /> },
  { key: "/attendance", label: "Qatnashish", icon: <CalendarOutlined /> },
  { key: "/payments", label: "To'lov", icon: <DollarOutlined /> },
  { key: "/settings", label: "Sozlamalar", icon: <SettingOutlined /> },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch(); 

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={220}
      className={styles.sidebar}
    >
      <div className={styles.sidebarInner}>
        <div>
          <div className={styles.sidebarHeader}>
            <div className={collapsed ? styles.logoCollapsed : styles.logo}>
              {!collapsed ? "SchoolAdmin" : "SA"}
            </div>
            <Button
              type="text"
              onClick={toggleCollapsed}
              className={styles.toggleButton}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            className={styles.menu}
            items={menuItems.map(({ key, label, icon }) => ({
              key,
              icon,
              label: <Link to={key}>{label}</Link>,
            }))}
          />
        </div>

        <div className={styles.sidebarFooter}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <span className={styles.userAvatar}>
              <UserOutlined />
            </span>
            {!collapsed && <div className={styles.userName}>Admin User</div>}
          </div>
          <div>
            <Button onClick={handleLogout} block icon={<LogoutOutlined />} danger>
              logout
            </Button>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
