import { useState } from "react";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">Sign In</h2>
            <p className="auth-subtitle">Please sign in to your account</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
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
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
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
                <button type="submit" className="auth-button">
                    Sign In
                </button>
            </form>
            <p className="auth-footer">
                Don't have an account? <a href="/signup">Sign Up</a>
            </p>
        </div>
    );
}

export default SignIn;
