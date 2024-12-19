import React, { useState } from "react";
import API_URL from "../config/apiConfig";
import Cookies from 'js-cookie';

function SignIn({ toggleForm, setToken, onLoginSuccess, setAccountId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");  
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Invalid email or password.");
      } else {
        const responseData = await response.json();

        Cookies.set('token', responseData.token, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set('role', responseData.role, { expires: 7, secure: true, sameSite: 'Strict' });

        setToken(responseData.token);
        setAccountId(responseData.accountId);
        onLoginSuccess();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign In</h2>
      <p className="auth-subtitle">Please sign in to your account</p>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account?{" "}
        <span onClick={toggleForm} className="auth-link">Sign Up</span>
      </p>
    </div>
  );
}

export default SignIn;
