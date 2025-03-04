import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/Loader";
import logo from "../../assets/logo.png";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password).finally(() =>
        setLoading(false)
      );
      setEmail("");
      setPassword("");
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className={styles.container}>
          <div className={styles.card}>
          <img className={styles.logoImg} src={logo} alt="Logo" />
            <h2 className={styles.heading}>Login</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            {error && <p className={styles.error}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
