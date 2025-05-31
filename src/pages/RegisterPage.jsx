import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Optional: clear fields on mount
  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  const [welcomeName, setWelcomeName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic input check (required attributes already cover this in most cases)
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const result = register(name, email, password);
    if (result === true) {
        setWelcomeName(name);
        setTimeout(() => {
      // Registration successful, redirect to login
      navigate("/login");
    }, 2000);
}
     else {
      // Registration failed, display error message (don't clear fields)
      setError(result);
    }
  };

  return (
    <div className="register-container">
  <h2 className="register-title">Register</h2>

  
  {error && <div className="register-error">{error}</div>}
  <form onSubmit={handleSubmit}>
  <div className="input-group">
    <span className="input-icon">👤</span>
    <input
      className="register-input"
      type="text"
      placeholder="Name"
      value={name}
      onChange={e => setName(e.target.value)}
      autoComplete="name"
      required
    />
  </div>

  <div className="input-group">
    <span className="input-icon">📧</span>
    <input
      className="register-input"
      type="email"
      placeholder="Email"
      value={email}
      onChange={e => setEmail(e.target.value)}
      autoComplete="username"
      required
    />
  </div>

  <div className="input-group">
    <span className="input-icon">🔒</span>
    <input
      className="register-input"
      type="password"
      placeholder="Password"
      value={password}
      onChange={e => setPassword(e.target.value)}
      autoComplete="new-password"
      required
    />
  </div>

  <button className="register-button" type="submit">
    Register
  </button>

  <p className="register-footer">
    Already have an account?{" "}
    <button onClick={() => navigate("/login")} className="register-link">
      Login
    </button>
  </p>
</form>

</div>

  );
};

export default RegisterPage;
