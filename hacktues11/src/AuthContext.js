import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [privileges, setPrivileges] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:5000/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("privileges", data.privileges);
        console.log(data.token);
        if(data.privileges === "admin"){
          navigate("/admin");
        }else{
          navigate("/user");
        }
      } else {
        console.error("Failed to login");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const signup = async (firstname, lastname, email, password) => {
    try {
      const response = await fetch(`http://localhost:5000/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({firstname, lastname, email, password}),
      });

      if (response.ok) {
        navigate("/login")
      } else {
        console.error("Failed to create account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  }

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
