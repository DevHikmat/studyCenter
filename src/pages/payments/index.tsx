import { useState } from "react"
import styles from "./payments.module.css"

export default function PaymentsPage() {
  const [filter, setFilter] = useState("all")
  const [month, setMonth] = useState("June 2023")
  const [payments, setPayments] = useState([
    { id: 1, student: "John Doe", amount: 500, dueDate: "2023-06-15", status: "paid", paidDate: "2023-06-10" },
    { id: 2, student: "Jane Smith", amount: 500, dueDate: "2023-06-15", status: "paid", paidDate: "2023-06-12" },
    { id: 3, student: "Robert Johnson", amount: 500, dueDate: "2023-06-15", status: "overdue", paidDate: null },
    { id: 4, student: "Emily Davis", amount: 500, dueDate: "2023-06-15", status: "pending", paidDate: null },
    { id: 5, student: "Michael Brown", amount: 500, dueDate: "2023-06-15", status: "paid", paidDate: "2023-06-08" },
    { id: 6, student: "Sarah Wilson", amount: 500, dueDate: "2023-06-15", status: "pending", paidDate: null },
    { id: 7, student: "David Taylor", amount: 500, dueDate: "2023-06-15", status: "overdue", paidDate: null },
  ])

  const months = [
    "January 2023",
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
    "July 2023",
    "August 2023",
  ]

  const changeMonth = (newMonth) => {
    setMonth(newMonth)
    // Haqiqiy ilovada yangi oyga oid ma'lumotlarni fetch qilish mumkin
  }

  const updatePaymentStatus = (paymentId, newStatus) => {
    setPayments(
      payments.map((payment) => {
        if (payment.id === paymentId) {
          return {
            ...payment,
            status: newStatus,
            paidDate: newStatus === "paid" ? new Date().toISOString().split("T")[0] : null,
          }
        }
        return payment
      }),
    )
  }

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true
    return payment.status === filter
  })

  const getPaymentSummary = () => {
    const total = payments.length
    const paid = payments.filter((p) => p.status === "paid").length
    const pending = payments.filter((p) => p.status === "pending").length
    const overdue = payments.filter((p) => p.status === "overdue").length

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const collectedAmount = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

    return { total, paid, pending, overdue, totalAmount, collectedAmount }
  }

  const summary = getPaymentSummary()

  return (
    <div className={styles.paymentsPage}>
      <h1 className={styles.pageTitle}>Monthly Payments</h1>

      <div className={styles.monthSelector}>
        <select value={month} onChange={(e) => changeMonth(e.target.value)} className={styles.monthDropdown}>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.paymentSummary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>${summary.totalAmount}</div>
          <div className={styles.summaryLabel}>Total Amount</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>${summary.collectedAmount}</div>
          <div className={styles.summaryLabel}>Collected</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{summary.paid}</div>
          <div className={styles.summaryLabel}>Paid</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>{summary.pending + summary.overdue}</div>
          <div className={styles.summaryLabel}>Unpaid</div>
        </div>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`${styles.filterButton} ${filter === "paid" ? styles.active : ""}`}
            onClick={() => setFilter("paid")}
          >
            Paid
          </button>
          <button
            className={`${styles.filterButton} ${filter === "pending" ? styles.active : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`${styles.filterButton} ${filter === "overdue" ? styles.active : ""}`}
            onClick={() => setFilter("overdue")}
          >
            Overdue
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.paymentsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Paid Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className={payment.status === "overdue" ? styles.overdueRow : ""}>
                <td>{payment.id}</td>
                <td>{payment.student}</td>
                <td>${payment.amount}</td>
                <td>{payment.dueDate}</td>
                <td>
                  <span className={`${styles.status} ${styles[payment.status]}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td>{payment.paidDate || "-"}</td>
                <td className={styles.actions}>
                  {payment.status !== "paid" && (
                    <button className={styles.markPaidButton} onClick={() => updatePaymentStatus(payment.id, "paid")}>
                      Mark Paid
                    </button>
                  )}
                  {payment.status === "overdue" && (
                    <button
                      className={styles.reminderButton}
                      onClick={() => alert(`Reminder sent to ${payment.student}`)}
                    >
                      Send Reminder
                    </button>
                  )}
                  {payment.status === "paid" && (
                    <button className={styles.receiptButton} onClick={() => alert(`Receipt for ${payment.student}`)}>
                      Receipt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
