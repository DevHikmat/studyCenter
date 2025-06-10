import React from "react";
import styles from "./dashboard.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const Dashboard: React.FC = () => {
  const {studentList: students} = useSelector((state: RootState) => state.students);
  const stats = [
    { title: "Total Students", value: students?.length, icon: "👨‍🎓" },
    { title: "Present Today", value: students?.length, icon: "✅" },
    { title: "Pending Payments", value: "13", icon: "⚠️" },
    { title: "Total Revenue", value: "$12,450", icon: "💵" },
  ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.gridItem}>
          <h2 className={styles.sectionTitle}>Recent Students</h2>
          <div className={styles.recentList}>
            {students.map((student, i) => (
              <div key={i} className={styles.listItem}>
                <span>{student.firstName} {student.lastName}</span>
                <span className={styles.listItemDate}>
                  Joined {i + 1} day{i !== 0 ? "s" : ""} ago
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.gridItem}>
          <h2 className={styles.sectionTitle}>Payment Status</h2>
          <div className={styles.paymentStatus}>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Paid</div>
              <div className={styles.statusBar}>
                <div
                  className={styles.statusFill}
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className={styles.statusValue}>75%</div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Pending</div>
              <div className={styles.statusBar}>
                <div
                  className={styles.statusFill}
                  style={{
                    width: "15%",
                    backgroundColor: "var(--warning-color)",
                  }}
                ></div>
              </div>
              <div className={styles.statusValue}>15%</div>
            </div>
            <div className={styles.statusItem}>
              <div className={styles.statusLabel}>Overdue</div>
              <div className={styles.statusBar}>
                <div
                  className={styles.statusFill}
                  style={{
                    width: "10%",
                    backgroundColor: "var(--danger-color)",
                  }}
                ></div>
              </div>
              <div className={styles.statusValue}>10%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
