import React from "react";
import { ConfigProvider } from "antd";
import styles from "./layout.module.css";
import "../styles/global.css";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#3a36db",
          borderRadius: 6,
          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
        },
      }}
    >
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}><Outlet /></main>
      </div>
    </ConfigProvider>
  );
};

export default RootLayout;
