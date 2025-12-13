import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./index.css";

const API_BASE = "http://localhost:5000";

const SharedExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("goal");
    return savedGoal ? Number(savedGoal) : 10000;
  });

  const categories = ["Food", "Travel", "Entertainment", "Bills", "Other"];
  const COLORS = ["#6A0DAD", "#8A2BE2", "#BA55D3", "#9370DB", "#DDA0DD"];

  // ✅ Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/expenses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("fetchExpenses error:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ✅ Persist goal to localStorage
  useEffect(() => {
    localStorage.setItem("goal", goal);
  }, [goal]);

  // ✅ ADD EXPENSE (updated with full debug)
  const addExpense = async () => {
    if (!person || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Missing authentication token. Please log in again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          person,
          amount: parseFloat(amount),
          category,
        }),
      });

      // Read the raw text response to help debug any backend errors
      const text = await res.text();
      console.log("📦 Raw response from backend:", text);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${text}`);
      }

      // Parse valid JSON
      const newExpense = JSON.parse(text);

      // Update UI immediately
      setExpenses((prev) => [newExpense, ...prev]);
      setPerson("");
      setAmount("");
    } catch (err) {
      console.error("❌ addExpense error:", err);
      alert("Add failed: " + err.message);
    }
  };

  // ✅ Delete single expense
  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error("deleteExpense error:", err);
    }
  };

  // ✅ Clear all expenses
  const clearAllExpenses = async () => {
    if (window.confirm("Are you sure you want to clear all expenses?")) {
      try {
        const res = await fetch(`${API_BASE}/api/expenses/clear/all`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Failed to clear expenses");
        setExpenses([]);
      } catch (err) {
        console.error("clearAllExpenses error:", err);
      }
    }
  };

  // ✅ Weekly summary
  const getWeeklySummary = () => {
    const summary = {};
    expenses.forEach((exp) => {
      const week = getWeekNumber(exp.date);
      summary[week] = (summary[week] || 0) + exp.amount;
    });
    return Object.entries(summary).map(([week, total]) => ({ week, total }));
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("📊 Shared Expenses Report", 14, 15);
    const tableColumn = ["Person", "Amount (₹)", "Category", "Date"];
    const tableRows = expenses.map((e) => [
      e.person,
      e.amount.toFixed(2),
      e.category,
      new Date(e.date).toLocaleDateString(),
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { halign: "center" },
      headStyles: { fillColor: [138, 43, 226] },
    });
    let finalY = doc.lastAutoTable.finalY || 40;
    doc.text(`Total Spent: ₹${totalSpent.toLocaleString()}`, 14, finalY + 10);
    doc.text(`Savings Goal: ₹${goal.toLocaleString()}`, 14, finalY + 20);
    doc.save("expenses-report.pdf");
  };

  // ✅ Export CSV
  const exportCSV = () => {
    let csv = "Person,Amount,Category,Date\n";
    expenses.forEach((e) => {
      csv += `${e.person},${e.amount},${e.category},${new Date(
        e.date
      ).toLocaleDateString()}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  const categoryData = categories.map((cat) => ({
    name: cat,
    value: expenses
      .filter((e) => e.category === cat)
      .reduce((acc, e) => acc + e.amount, 0),
  }));

  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <Navbar />
      <div className="shared-expenses-wrapper">
        {/* LEFT COLUMN */}
        <div className="shared-expenses-column">
          <div className="shared-expenses-card">
            <h1 className="title">💰 Shared Expenses Tracker</h1>

            {/* Form */}
            <div className="expense-form">
              <input
                type="text"
                placeholder="Person"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button onClick={addExpense}>➕ Add</button>
            </div>

            {/* Expense List */}
            <h2>📋 All Expenses</h2>
            <ul className="expense-list">
              {expenses.map((e) => (
                <li key={e._id}>
                  <b>{e.person}</b> spent ₹{e.amount} on {e.category} (
                  {new Date(e.date).toLocaleDateString()}){" "}
                  <button
                    className="delete-btn"
                    onClick={() => deleteExpense(e._id)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>

            {expenses.length > 0 && (
              <button className="clear-btn" onClick={clearAllExpenses}>
                ❌ Clear All Expenses
              </button>
            )}
          </div>

          {/* Weekly + Category Charts */}
          <div className="shared-expenses-card">
            <h2>📊 Weekly Summary</h2>
            <BarChart width={500} height={300} data={getWeeklySummary()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8A2BE2" />
            </BarChart>

            <h2>🍕 Category Distribution</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="shared-expenses-card split-costs-card">
          <h2>🎯 Savings Goal Tracker</h2>
          <p>
            Goal: ₹{goal.toLocaleString()} | Spent: ₹
            {totalSpent.toLocaleString()}
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((totalSpent / goal) * 100, 100)}%`,
              }}
            ></div>
          </div>

          <div className="goal-input">
            <input
              type="number"
              placeholder="Set New Goal"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />
          </div>

          {/* Recent Transactions */}
          <h2>🧾 Recent Transactions</h2>
          <ul>
            {recentTransactions.map((e) => (
              <li key={e._id}>
                <b>{e.person}</b> → ₹{e.amount} on {e.category} (
                {new Date(e.date).toLocaleDateString()})
              </li>
            ))}
          </ul>

          {/* Export Buttons */}
          <div className="export-buttons">
            <button onClick={exportPDF}>📄 Export PDF</button>
            <button onClick={exportCSV}>📊 Export CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedExpenses;
