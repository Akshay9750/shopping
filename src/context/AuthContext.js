import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/profile", {
          headers: { "x-auth-token": token },
        })
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      // Fetch user data after registration
      const userRes = await axios.get("http://localhost:5000/profile", {
        headers: { "x-auth-token": res.data.token },
      });
      setUser(userRes.data);
    } catch (error) {
      console.error("Registration error:", error.response.data.msg);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      // Fetch user data after login
      const userRes = await axios.get("http://localhost:5000/profile", {
        headers: { "x-auth-token": res.data.token },
      });
      setUser(userRes.data);
    } catch (error) {
      console.error("Login error:", error.response.data.msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
