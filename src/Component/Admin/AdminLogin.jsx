import { useState } from "react";
import { AdminStore } from "./AdminStore";

const AdminLogin = ({ onSuccess }) => {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    setTimeout(() => {
      if (AdminStore.login(pwd)) {
        setError(false);
        onSuccess();
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="adm-login">
      <div className="adm-login-box">
        <h1>St Manuel</h1>
        <p>Admin Panel · Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="adm-field adm-login-field">
            <label className="adm-label">Password</label>
            <input
              type="password"
              className="adm-input"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              autoFocus
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`adm-btn adm-login-submit btn-loading${loading ? " is-loading" : ""}`}
            disabled={loading}
          >
            <span className="btn-loading-label">Sign In</span>
            <span className="btn-spinner" aria-hidden="true" />
          </button>
          {error && (
            <p className="adm-login-error">Incorrect password. Try again.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
