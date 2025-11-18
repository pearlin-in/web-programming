import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/homepage.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null); // New: transaction to edit
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({ monthly_income: 5000 }); // default fallback

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadUser();
    loadCategories();
    loadTransactions();
    // eslint-disable-next-line
  }, []);

  function loadUser() {
    axios.get("http://localhost:5000/api/users/me", { headers })
      .then(res => setUser(res.data.user || { monthly_income: 5000 }))
      .catch(() => setUser({ monthly_income: 5000 }));
  }

  function loadCategories() {
    axios.get("http://localhost:5000/api/categories/user/transactions", { headers })
      .then(res => setCategories(res.data.categories || []));
  }

  function loadTransactions() {
    setLoading(true);
    axios.get("http://localhost:5000/api/transactions", { headers })
      .then(res => {
        setTransactions(res.data.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function filteredTransactions() {
    // Adjust this if you use type_name or category_id for filtering
    return transactions.filter(tx =>
      (!filterCat || tx.type_name === filterCat) &&
      (!search || (tx.description || "").toLowerCase().includes(search.toLowerCase()))
    );
  }

  function handleAddTransaction(e) {
    e.preventDefault();
    setError('');
    const form = e.target;
    const description = form.description.value.trim();
    const category_id = Number(form.category.value);
    const is_important = form.is_important.checked;
    const date = new Date().toISOString().slice(0, 10);

    // Always negative expenses
    let amount = -Math.abs(Number(Number(form.amount.value || "0").toFixed(2)));

    if (!description || !category_id || !amount) {
      setError("Please fill all fields.");
      return;
    }

    axios.post("http://localhost:5000/api/transactions", {
      description,
      amount,
      category_id,
      is_important,
      date
    }, { headers })
      .then(() => {
        setShowModal(false);
        loadTransactions();
        loadUser();
      })
      .catch(err => {
        setError(err.response?.data?.error || "Failed to add transaction.");
      });
  }

  function handleUpdateTransaction(e) {
    e.preventDefault();
    setError('');
    const form = e.target;
    const description = form.description.value.trim();
    const category_id = Number(form.category.value);
    const is_important = form.is_important.checked;
    const amount = -Math.abs(Number(Number(form.amount.value || "0").toFixed(2))); // negative

    if (!description || !category_id) {
      setError("Please fill all fields.");
      return;
    }

    axios.put(`http://localhost:5000/api/transactions/${editTx.id}`, {
        description, amount, category_id, is_important
      }, { headers })
      .then(() => {
        setEditTx(null);
        loadTransactions();
        loadUser();
      })
      .catch(err => setError(err.response?.data?.error || "Failed to update transaction."));
  }

  function handleDeleteTransaction(id) {
    axios.delete(`http://localhost:5000/api/transactions/${id}`, { headers })
      .then(() => {
        setEditTx(null);
        loadTransactions();
        loadUser();
      })
      .catch(() => setError("Failed to delete transaction."));
  }

  const catColor = (id) => {
    const cat = categories.find((c) => String(c.id) === String(id));
    return cat ? cat.colour : "#dbeafe";
  };

  // Calculate remaining amount (for progress bar)
  const today = new Date();
  const currentMonthTx = transactions.filter(
    tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === today.getMonth() &&
        txDate.getFullYear() === today.getFullYear();
    }
  );
  const totalSpentAbs = Math.abs(
    currentMonthTx.reduce((sum, tx) => sum + Number(tx.amount), 0)
  );
  const income = user.monthly_income || 0;
  const remaining = income - totalSpentAbs;
  const percentRemaining = income > 0
    ? Math.max(0, Math.min(100, (remaining / income) * 100))
    : 0;
  useEffect(() => {
    if (remaining <= 1000 && remaining > 0) {
      if (window.showBudgetAlertWithJQuery) {
        window.showBudgetAlertWithJQuery();
      }
    }
  }, [remaining]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <i className="fas fa-wallet"></i>
            <span>Aureus Flow</span>
          </div>
          <ul className="nav-menu">
            <li><a href="/home">Home</a></li>
            <li><a href="/savings">Savings</a></li>
            <li><a href="/transactions" className="active">Transactions</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          <div className="welcome" style={{ marginBottom: "1.7rem" }}>
            <h1 style={{ fontSize: "2.2rem" }}>Transactions</h1>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar" style={{ marginBottom: "0.6rem" }}>
            <div
              className="progress-fill"
              style={{
                width: `${percentRemaining}%`,
                background: "linear-gradient(90deg, #ef4444 0%, #c53b3b 100%)"
              }}
            ></div>
          </div>
          <div style={{ color: "var(--text-secondary)", marginBottom: "1.2rem", fontSize: "1.5rem" }}>
            Remaining this month:
            <b style={{ color: "var(--primary-dark)" }}>£{remaining.toFixed(2)}</b>
          </div>

          {/* Filters Row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            marginBottom: "1rem"
          }}>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: "1 1 200px",
                padding: "0.7rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)"
              }}
            />
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              style={{
                padding: "0.7rem 1rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)"
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                 <option value={cat.type_name} key={cat.id}>{cat.type_name}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              Add Transaction
            </button>
          </div>

          {/* Transaction History Grid */}
          <div id="fundsGrid">
            {loading ? (
              <div className="no-data">Loading...</div>
            ) : (
              filteredTransactions().length === 0 ? (
                <div className="no-data">No transactions yet.</div>
              ) : (
                filteredTransactions().map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    className="fund-card"
                    style={{
                      borderLeft: `6px solid ${catColor(tx.category_id)}`,
                      background: "#fff",
                      cursor: "pointer"
                    }}
                    onClick={() => setEditTx(tx)}
                  >
                    <div style={{
                      display: 'flex', justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span style={{
                        fontWeight: "600",
                        color: "var(--primary-dark)",
                        fontSize: "1.07rem"
                      }}>
                        {tx.description}
                      </span>
                      <span className="tx-expense">
                        -£{Math.abs(Number(tx.amount)).toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.25rem"
                    }}>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                        {categories.find(c => String(c.id) === String(tx.category_id))?.type_name}
                      </span>
                      {tx.is_important && (
                        <span style={{ color: "#f8961e", fontWeight: 600, marginLeft: "8px" }}>
                          ⭐ Important
                        </span>
                      )}
                      <span style={{ color: "var(--text-secondary)", fontSize: ".98rem" }}>
                        {tx.date ? (tx.date.slice ? tx.date.slice(0, 10) : "") : ""}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </main>

      {/* Modal (Add Transaction) */}
      {showModal && (
        <div className="fund-edit-modal" onClick={() => setShowModal(false)}>
          <form
            className="form-container"
            style={{ maxWidth: "440px", minWidth: "290px" }}
            onSubmit={handleAddTransaction}
            onClick={e => e.stopPropagation()}
          >
            <h2>Add Your Recent Transaction</h2>
            <label>Description</label>
            <input name="description" required />
            <label>Amount (£)</label>
            <input name="amount" type="number" step="0.01" required />
            <label>Category</label>
            <select name="category" required>
              <option value="">Pick category</option>
              {categories.map(cat => (
                <option value={cat.id} key={cat.id}>{cat.type_name}</option>
              ))}
            </select>
            <label>
              <input name="is_important" type="checkbox" style={{ marginRight: "0.5rem" }} />
              Important
            </label>
            <button className="btn-primary" style={{ marginTop: "1rem" }} type="submit">Confirm</button>
            <button className="btn-secondary" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      )}

      {/* Modal (Edit Transaction) */}
      {editTx && (
        <div className="fund-edit-modal" onClick={() => setEditTx(null)}>
          <form
            className="form-container"
            style={{ maxWidth: "440px", minWidth: "290px" }}
            onSubmit={handleUpdateTransaction}
            onClick={e => e.stopPropagation()}
          >
            <h2>Edit Transaction</h2>
            <label>Description</label>
            <input name="description" defaultValue={editTx.description} required />
            <label>Amount (£)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              defaultValue={Math.abs(Number(editTx.amount))}
              required
            />
            <label>Category</label>
            <select name="category" defaultValue={editTx.category_id} required>
              <option value="">Pick category</option>
              {categories.map(cat => (
                <option value={cat.id} key={cat.id}>{cat.type_name}</option>
              ))}
            </select>
            <label>
              <input
                name="is_important"
                type="checkbox"
                defaultChecked={!!editTx.is_important}
                style={{ marginRight: "0.5rem" }}
              />
              Important
            </label>
            <button className="btn-primary" style={{ marginTop: "1rem" }} type="submit">Update</button>
            <button
              className="btn-secondary"
              type="button"
              style={{ background: "#fff0f0", color: "#d32f2f", fontWeight: 700, marginTop: ".8rem" }}
              onClick={() => handleDeleteTransaction(editTx.id)}
            >Delete</button>
            <button className="btn-secondary" type="button" onClick={() => setEditTx(null)}>Cancel</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
