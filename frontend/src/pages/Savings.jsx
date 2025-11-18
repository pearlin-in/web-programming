import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/homepage.css";

export default function Savings() {
  const [funds, setFunds] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editFund, setEditFund] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    loadFunds();
  }, []);

  function loadFunds() {
    setLoading(true);
    axios.get('http://localhost:5000/api/savings/funds', { headers })
      .then(res => {
        setFunds(res.data.funds);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  function showCreateForm() { setCreating(true); setError(''); }

  function handleCreateFund(e) {
    e.preventDefault();
    setError('');
    const name = e.target.name.value;
    const target_amount = e.target.target.value;
    const priority = e.target.priority.value;
    if (!name || !target_amount || !priority) {
      setError('Please fill all fields.');
      return;
    }
    axios.post('http://localhost:5000/api/savings/funds',
      { name, target_amount, priority },
      { headers })
    .then(() => {
      setCreating(false);
      loadFunds();
    })
    .catch(() => setError('Failed to create fund.'));
  }

  function handleUpdateFund(e) {
    e.preventDefault();
    setError('');
    axios.put(`http://localhost:5000/api/savings/funds/${editFund.id}`,
      {
        name: editFund.name,
        current_amount: e.target.current.value,
        target_amount: e.target.target.value
      },
      { headers })
    .then(() => {
      setEditFund(null);
      loadFunds();
    })
    .catch(() => setError('Failed to update fund.'));
  }

  function handleDeleteFund(id) {
    axios.delete(`http://localhost:5000/api/savings/funds/${id}`, { headers })
      .then(() => {
        setEditFund(null);
        loadFunds();
      })
      .catch(() => setError('Failed to delete fund.'));
  }

  function calcPercent(current, target) {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  }

  return (
    <div>
      {/* Navbar (copy/paste from homepage) */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <i className="fas fa-wallet"></i>
            <span>Aureus Flow</span>
          </div>
          <ul className="nav-menu">
            <li><a href="/home">Home</a></li>
            <li><a href="/savings" className="active">Savings</a></li>
            <li><a href="/transactions">Transactions</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="welcome">
            <h1 style={{fontSize:"2.2rem", marginBottom:"1rem"}}>My Savings Goals</h1>
            <p>Your personal goals, progress, and priorities at a glance.</p>
          </div>

          {/* Create Fund Button */}
          <div style={{textAlign:"center", marginBottom:"1.5rem"}}>
            <button className="btn-primary" onClick={showCreateForm}>+ Create Fund</button>
          </div>

          {/* Create Fund Form */}
          {creating && (
            <form onSubmit={handleCreateFund} className="form-container">
                <h2>Create Savings Goal</h2>
                <label htmlFor="fund-name">Fund Name</label>
                <input name="name" id="fund-name" placeholder="e.g. Emergency Fund" required />

                <label htmlFor="target-amount">Target Amount</label>
                <input name="target" id="target-amount" type="number" step="0.01" placeholder="e.g. 5000" min="1" required />

                <label htmlFor="priority">Priority</label>
                <select name="priority" id="priority" required>
                <option value="high">High</option>
                <option value="medium" selected>Medium</option>
                <option value="low">Low</option>
                </select>

                <button type="submit" className="btn-primary">Create Fund</button>
                <button type="button" className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
                {error && <div className="error">{error}</div>}
            </form>
            )}


          {/* Loading/Error */}
          {loading && <div className="no-data">Loading funds...</div>}

          {/* Funds Grid */}
          <section style={{marginTop:"2rem", marginBottom:"1rem"}}>
            <div id="fundsGrid">
              {funds.length === 0 && !loading ?
                <div className="no-data">No funds yet.</div> :
                funds.map(fund => (
                  <div key={fund.id} className="fund-card" onClick={() => setEditFund(fund)}>
                    <div className="fund-title" style={{fontSize:"1.2rem", fontWeight:"600", marginBottom:"0.5rem"}}>{fund.name}</div>
                    <div className="fund-amount-row">
                      <span>AED {fund.current_amount} / AED {fund.target_amount}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${calcPercent(Number(fund.current_amount ?? 0), Number(fund.target_amount ?? 1))}%`
                        }}
                      />
                    </div>
                    <div className="progress-text">
                      {calcPercent(fund.current_amount, fund.target_amount).toFixed(0)}% funded
                    </div>
                  </div>
                ))
              }
            </div>
          </section>

          {/* Edit Fund Modal/Card */}
          {editFund && (
            <div className="fund-edit-modal" onClick={() => setEditFund(null)}>
              <form
                onSubmit={handleUpdateFund}
                className="form-container"
                style={{ minWidth: 340, maxWidth: 420, position: 'relative' }}
                onClick={e => e.stopPropagation()} // Prevent modal close on input click
              >
                <h2>Edit: {editFund.name}</h2>
                <label>Current Amount</label>
                <input name="current" defaultValue={editFund.current_amount} type="number" min="0" required />
                <label>Target Amount</label>
                <input name="target" defaultValue={editFund.target_amount} type="number" min="1" required />
                <button type="submit" className="btn-primary">Update Fund</button>
                <button type="button" className="btn-secondary" onClick={() => handleDeleteFund(editFund.id)}>
                  Delete Fund
                </button>
                <button type="button" className="btn-secondary" onClick={() => setEditFund(null)}>
                  Cancel
                </button>
                {error && <div className="error">{error}</div>}
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
