
import React, { useEffect } from "react";
import { Route, Navigate } from "react-router-dom";

const isAuthenticated = () => {
    
        const token = localStorage.getItem("token");

        
        const isValidToken =
          token !== null && token !== 'undefined' && token.trim() !== "";
        // Check if token exists and is not undefined, null, or empty after trimming whitespace
        return isValidToken;

    
 
};

const PrivateRoute = ({ children }) => {
  const auth = isAuthenticated();
  return auth ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
