import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/homepage.css";

export default function Profile() {
  const [user, setUser] = useState({});
  const [income, setIncome] = useState(5000);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/me", { headers })
      .then(res => {
        setUser(res.data.user || {});
        const val = res.data.user?.monthly_income;
      setIncome(val === 0 || val === null || val === undefined ? "" : String(val));
    });
}, []);

 const handleIncomeChange = e => {
  // allow blank field (for user to erase and type)
  setIncome(e.target.value);
  setSuccess(""); // hide any prior message while editing
  setError("");
};

const handleIncomeUpdate = e => {
  e.preventDefault();
  setError(""); setSuccess("");
  // clean handling for 0, negative, or blank
  if (income === "" || isNaN(Number(income))) {
    setError("Monthly income cannot be blank.");
    return;
  }
  if (Number(income) < 0) {
    setError("Monthly income must be zero or a positive number.");
    return;
  }
  axios.put("http://localhost:5000/api/users/me/income",
    { monthly_income: Number(income) },
    { headers }
  )
    .then(() => {
      setSuccess("Monthly income (your budget) updated!");
      setUser(prev => ({ ...prev, monthly_income: Number(income) }));
      setTimeout(() => setSuccess(""), 1500);
    })
    .catch(() => setError("Failed to update income."));
};

  const getInitials = name =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .map(w => w[0].toUpperCase())
      .join("")
      .slice(0, 2);

  const initialsBG = {
    background: "linear-gradient(135deg, #4361ee55, #3a0ca377)",
    color: "#4361ee"
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo"><i className="fas fa-wallet"></i><span>Aureus Flow</span></div>
          <ul className="nav-menu">
            <li><a href="/home">Home</a></li>
            <li><a href="/savings">Savings</a></li>
            <li><a href="/transactions">Transactions</a></li>
            <li><a href="/profile" className="active">Profile</a></li>
          </ul>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      <main className="main" style={{ maxWidth: "none", width: "100vw", paddingLeft: 0, paddingRight: 0 }}>
        <div className="container" style={{
          maxWidth: 1350,
          margin: "auto",
          padding: "2.3rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div className="balance-card" style={{
            width: "100%",
            maxWidth: 700,
            marginBottom: "2.7rem",
            borderTop: "5.5px solid #4361ee",
            boxShadow: "0 5px 18px #b5bffd18",
            background: "#fff"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
              <div style={{
                ...initialsBG,
                minWidth: 92, minHeight: 92, borderRadius: "50%",
                fontSize: "2.7rem", fontWeight: 900, display: "flex",
                alignItems: "center", justifyContent: "center", boxShadow: "0 1px 12px #a7b6f544"
              }}>
                {getInitials(user.name)}
              </div>
              <div>
                <div style={{ color: "var(--primary-dark)", fontSize: "1.65rem", fontWeight: 800, marginBottom: 4 }}>{user.name || "--"}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "1.09rem", marginBottom: 2 }}>{user.email || "--"}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: ".98rem", marginTop: 4 }}>
                  <i className="fas fa-coins"></i> Preferred currency: <b>GBP (AED )</b>
                </div>
                <div style={{
                  marginTop: 13, color: "#4cc9f0", fontWeight: 500, fontSize: ".99rem"
                }}>
                  Member since: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Monthly Income */}
          <form onSubmit={handleIncomeUpdate} className="form-container" style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
            <label style={{ fontWeight: 700, fontSize: "1.17rem", color: "var(--primary-color)" }}>
              Monthly Income (Your Budget) (AED )
            </label>
            <input
              type="number"
              value={income}
              min="0"
              onChange={handleIncomeChange}
              className="input"
              style={{ fontSize: "1.18rem", fontWeight: 500, marginBottom: "1.2rem" }}
              required
            />
            <button type="submit" className="btn-primary" style={{ marginBottom: ".7rem" }}>
              Save
            </button>
            {success && <div style={{ color: "#10b981", marginTop: "1.3rem", fontWeight: 600 }}>{success}</div>}
            {error && <div className="error">{error}</div>}
            <div style={{ marginTop: "1.1rem", color: "var(--text-secondary)", fontSize: ".97rem" }}>
              <i className="fas fa-info-circle"></i> This value is your budget and is used in your transactions page.
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
