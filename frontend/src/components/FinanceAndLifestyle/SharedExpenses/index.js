import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ correct import
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

const SharedExpenses = () => {
  // ✅ Load from localStorage OR empty array
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  // ✅ Load goal from localStorage OR default 10,000
  const [goal, setGoal] = useState(() => {
    const savedGoal = localStorage.getItem("goal");
    return savedGoal ? Number(savedGoal) : 10000;
  });

  const categories = ["Food", "Travel", "Entertainment", "Bills", "Other"];
  const COLORS = ["#6A0DAD", "#8A2BE2", "#BA55D3", "#9370DB", "#DDA0DD"];

  // ✅ Save expenses + goal to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("goal", goal);
  }, [goal]);

  // Add new expense
  const addExpense = () => {
    if (!person || !amount) return;
    const newExpense = {
      id: Date.now(),
      person,
      amount: parseFloat(amount),
      category,
      date: new Date(),
    };
    setExpenses([...expenses, newExpense]);
    setPerson("");
    setAmount("");
  };

  // ✅ Delete single expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // ✅ Clear all expenses
  const clearAllExpenses = () => {
    if (window.confirm("Are you sure you want to clear all expenses?")) {
      setExpenses([]);
      localStorage.removeItem("expenses");
    }
  };

  // Weekly summary
  const getWeeklySummary = () => {
    const summary = {};
    expenses.forEach((exp) => {
      const week = getWeekNumber(exp.date);
      summary[week] = (summary[week] || 0) + exp.amount;
    });
    return Object.entries(summary).map(([week, total]) => ({
      week,
      total,
    }));
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  // Total spent
  const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Export as PDF ✅ fixed & improved
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("📊 Shared Expenses Report", 14, 15);

    // Table
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
      headStyles: { fillColor: [138, 43, 226] }, // purple header
    });

    // Summary at bottom
    let finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(12);
    doc.text(`Total Spent: ₹${totalSpent.toLocaleString()}`, 14, finalY + 10);
    doc.text(`Savings Goal: ₹${goal.toLocaleString()}`, 14, finalY + 20);

    doc.save("expenses-report.pdf");
  };

  // Export as CSV
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

  // Pie Chart Data (overall categories)
  const categoryData = categories.map((cat) => ({
    name: cat,
    value: expenses
      .filter((e) => e.category === cat)
      .reduce((acc, e) => acc + e.amount, 0),
  }));

  // Recent transactions (last 5)
  const recentTransactions = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <Navbar />

      <div className="shared-expenses-wrapper">
        {/* Left column with 2 stacked cards */}
        <div className="shared-expenses-column">
          <div className="shared-expenses-card">
            <h1 className="title">💰 Shared Expenses Tracker</h1>

            {/* Input Form */}
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

            {/* Expense List with delete */}
            <h2>📋 All Expenses</h2>
            <ul className="expense-list">
              {expenses.map((e) => (
                <li key={e.id}>
                  <b>{e.person}</b> spent ₹{e.amount} on {e.category} (
                  {new Date(e.date).toLocaleDateString()}){" "}
                  <button
                    className="delete-btn"
                    onClick={() => deleteExpense(e.id)}
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

          <div className="shared-expenses-card">
            {/* Weekly Summary */}
            <h2>📊 Weekly Summary</h2>
            <BarChart width={500} height={300} data={getWeeklySummary()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8A2BE2" />
            </BarChart>

            {/* Category Pie Chart */}
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {/* Right column with Savings + Recent Transactions */}
        <div className="shared-expenses-card split-costs-card">
          <h2>🎯 Savings Goal Tracker</h2>
          <p>
            Goal: ₹{goal.toLocaleString()} | Spent: ₹
            {totalSpent.toLocaleString()}
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((totalSpent / goal) * 100, 100)}%` }}
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
              <li key={e.id}>
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
