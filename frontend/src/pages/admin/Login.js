import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();



  // Fetch CSRF token on component mount
  useEffect(() => {
    fetch("http://localhost/SFE-Project/backend/public/api/client/csrf", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.csrf_token) {
          // console.log("CSRF Token:", data.csrf_token);
          setCsrfToken(data.csrf_token);
        }
      })
      .catch(err => setError("Erreur lors de la récupération du token"));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (!csrfToken) {
      setError("Token CSRF manquant");
      return;
    }

    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    fetch("http://localhost/SFE-Project/backend/public/api/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
        csrf_token: csrfToken
      }),
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          window.localStorage.setItem("isLoggedIn",data.admin.token);
          window.localStorage.setItem("isLoggedIn",true);
          navigate("/");
        } else {
          setError(data.error || "Erreur de connexion");
        }
      })
      .catch(() => setError("Erreur de connexion"));
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h2 style={styles.title}>
          Connectez-vous à <br />
          <span style={styles.brand}>web design developemer</span>
        </h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
          )}
          <div style={styles.inputWrapper}>
            <span style={styles.icon}>
              <img src="/icons/mail.png" alt="email" style={styles.iconImg} />
            </span>
            <input
              type="text"
              placeholder="nom d'utilisateur"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ ...styles.input, paddingLeft: 44 }}
              autoComplete="username"
            />
          </div>
          <div style={styles.inputWrapper}>
            <span style={styles.icon}>
              <img src="/icons/padlock.png" alt="lock" style={styles.iconImg} />
            </span>
            <input
              type="password"
              placeholder="mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...styles.input, paddingLeft: 44 }}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
      <div style={styles.right}>
        <img
          src="/images/login.jpg"
          alt="Login illustration"
          style={styles.image}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  left: {
    flex: 1,
    padding: "2rem 3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 500,
  },
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    color: "#222",
    lineHeight: 1.2,
  },
  brand: {
    color: "#ff5e62",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
  },
  iconImg: {
    width: 22,
    height: 22,
    opacity: 0.7,
  },
  input: {
    padding: "1rem 1rem 1rem 44px",
    borderRadius: 10,
    border: "none",
    background: "#f1f1f1",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "1rem",
    borderRadius: 10,
    border: "none",
    background: "#ff5e62",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginTop: "1rem",
    letterSpacing: 1,
  },
  image: {
    width: "100%",
    maxWidth: 600,
    height: "auto",
  },
};