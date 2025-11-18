import "../css/welcome.css";

export default function Welcome() {
  return (
    <div className="welcome-main">
      <div className="welcome-box">
        <div className="welcome-logo">
          <i className="fas fa-wallet"></i>
        </div>
        <div className="welcome-title">Welcome to Aureus Flow</div>
        <div className="welcome-subtitle">Your smart, personal finance companion</div>
        <div className="welcome-buttons">
          <button className="btn-primary" onClick={() => window.location.href="/login"}>
            Login
          </button>
          <button className="btn-secondary" onClick={() => window.location.href="/signup"}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
