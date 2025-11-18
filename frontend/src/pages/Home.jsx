import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/homepage.css";

// Font Awesome CDN
const FontAwesomeLink = () => (
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />
);

export default function Home() {
  const [profile, setProfile] = useState({ name: "User" });
  const [balance, setBalance] = useState(0.0);
  const [goal, setGoal] = useState(null);
  const [allFunds, setAllFunds] = useState([]);
  const [stats, setStats] = useState({ income: 0, expenses: 0, saved: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // For protected backend routes
  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch DB info on mount
  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        // 1. Get user and income (budget)
        const profRes = await axios.get("http://localhost:5000/api/users/me", { headers });
        setProfile(profRes.data.user);

        // 2. Get all savings (funds/goals)
        const fundsRes = await axios.get("http://localhost:5000/api/savings/funds", { headers });
        const funds = fundsRes.data.funds || [];
        setAllFunds(funds);
        setGoal(funds.length > 0 ? funds[0] : null); // Show first fund as "current goal" in this layout

        // 3. Get all transactions
        const txRes = await axios.get("http://localhost:5000/api/transactions", { headers });
        const allTx = txRes.data.transactions || [];
        // Show 3 most recent
        setTransactions(allTx.slice(0, 3)); 

       // ----- THIS MATCHES YOUR TRANSACTIONS LOGIC -----
      const today = new Date();
      const thisMonthTx = allTx.filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      });

        // Expenses: absolute value of sum of negatives
        const totalSpentAbs = Math.abs(
          thisMonthTx.reduce((sum, tx) => sum + Number(tx.amount), 0)
        );
        const income = profRes.data.user?.monthly_income || 0;
        const remaining = income - totalSpentAbs; // This is what Transactions page uses

        // -------- Add all funds (savings) ---------
        const totalSaved = funds.reduce((sum, f) => sum + Number(f.current_amount || 0), 0);

        // Set Total Balance as remaining + total all funds
        setBalance(remaining + totalSaved);

        setStats({
          income,
          expenses: totalSpentAbs,
          saved: totalSaved,
        });


      } catch (err) {
        setProfile({ name: "User" });
        setGoal(null);
        setAllFunds([]);
        setBalance(0);
        setStats({ income: 0, expenses: 0, saved: 0 });
        setTransactions([]);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  // Format currency
  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  // Format date
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };
  // Date string
  const getCurrentDate = () =>
    new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Goal progress %
  const calcPercent = (current, target) =>
    target ? Math.min((current / target) * 100, 100) : 0;

  // Routing
  const goTo = (path) => window.location.href = path;
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <div className="main">
        <FontAwesomeLink />
        <div className="container">
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FontAwesomeLink />
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <i className="fas fa-wallet"></i>
            <span>Aureus Flow</span>
          </div>
          <ul className="nav-menu">
            <li><a href="/home" className="active">Home</a></li>
            <li><a href="/savings">Savings</a></li>
            <li><a href="/transactions">Transactions</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Welcome Section */}
          <div className="welcome">
            <h1>Welcome back, <span>{profile.name}</span>! 👋</h1>
            <p id="current-date">{getCurrentDate()}</p>
          </div>

          {/* Balance Card */}
          <div className="balance-card">
            <div className="balance-header">
              <h2>Total Balance</h2>
              <i className="fas fa-wallet"></i>
            </div>
            <div className="balance-amount">
              <span className="currency">AED </span>
              <span id="total-balance">{formatMoney(balance)}</span>
            </div>
            {/* No monthly change shown since formula now is income - expenses - saved */}
          </div>

          {/* Goal Progress */}
          <div className="goal-section">
            <div className="section-header">
              <h2>Current Goal</h2>
              <a href="/savings">View All</a>
            </div>
            <div id="goal-container">
              {goal ? (
                <div className="fund-item">
                  <div className="fund-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <div className="fund-details">
                    <div className="fund-title">{goal.name}</div>
                    <div className="fund-amount">
                      AED {formatMoney(goal.current_amount)} / AED {formatMoney(goal.target_amount)}
                    </div>
                  </div>
                  <div className="fund-progress">
                    {Math.round(calcPercent(goal.current_amount, goal.target_amount))}% 
                  </div>
                </div>
              ) : (
                <div className="no-data">
                  <i className="fas fa-bullseye"></i>
                  <p>No active goals</p>
                  <button className="btn-primary" onClick={() => goTo("/savings")}>
                    Set a Goal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stats">
            <div className="stat-box income">
              <div className="stat-icon"><i className="fas fa-arrow-down"></i></div>
              <div className="stat-info">
                <p>Income</p>
                <h3>AED <span id="income">{formatMoney(stats.income)}</span></h3>
              </div>
            </div>
            <div className="stat-box expense">
              <div className="stat-icon"><i className="fas fa-arrow-up"></i></div>
              <div className="stat-info">
                <p>Expenses</p>
                <h3>AED <span id="expenses">{formatMoney(stats.expenses)}</span></h3>
              </div>
            </div>
            <div className="stat-box saved">
              <div className="stat-icon"><i className="fas fa-piggy-bank"></i></div>
              <div className="stat-info">
                <p>Saved</p>
                <h3>AED <span id="saved">{formatMoney(stats.saved)}</span></h3>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="transactions-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <a href="/transactions">View All</a>
            </div>
            <div className="transactions-box" id="transactions-list">
              {transactions.length === 0 ? (
                <div className="no-data">
                  <i className="fas fa-receipt"></i>
                  <p>No transactions yet</p>
                </div>
              ) : (
                transactions.map((t, idx) => (
                  <div className="transaction-item" key={idx}>
                    <div className={`transaction-icon ${t.amount > 0 ? "income" : "expense"}`}>
                      <i className={`fas ${t.amount > 0 ? "fa-arrow-down" : "fa-arrow-up"}`}></i>
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-title">{t.description || t.type_name}</div>
                      <div className="transaction-category">{t.category || t.type_name}</div>
                    </div>
                    <div className="transaction-amount">
                      <div className="amount expense">
                        -AED {formatMoney(Math.abs(t.amount))}
                      </div>
                      <div className="transaction-date">
                        {formatDate(t.date)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Centered Quick Actions */}
          <div className="actions" style={{justifyContent: "center", gap: "2rem"}}>
            <button className="action-btn" onClick={() => goTo("/transactions")}>
              <i className="fas fa-plus"></i>
              <span>Add Transaction</span>
            </button>
            <button className="action-btn" onClick={() => goTo("/savings")}>
              <i className="fas fa-bullseye"></i>
              <span>New Goal</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
