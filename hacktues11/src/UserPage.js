import React from 'react';
import { useNavigate } from "react-router";
import { useEffect } from 'react';

const UserPage = () => {
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");
  
    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/verifytoken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({token}),
        });
  
        if (response.ok) {
          const data = await response.json();
          if(data.valid){
            navigate("/user");
          }else {
            localStorage.setItem("authToken", null);
            localStorage.setItem("privileges", null);
            navigate("/login")
          }
        } 
      } catch (error) {
        localStorage.setItem("authToken", null);
        localStorage.setItem("privileges", null);
        navigate("/login")
      }
    } else {
      navigate("/login");
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <div>
      <h1>User Page</h1>
      <p>Welcome to the user page</p>
    </div>
  );
};

export default UserPage;