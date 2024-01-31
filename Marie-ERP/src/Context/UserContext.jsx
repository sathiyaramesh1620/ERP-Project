import React, { createContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserContext = createContext();

const GlobalContext = ({children}) => {

  


  const nav = useNavigate();
  const [user, setUser] = useState(() => {
    // Retrieve user data from local storage during component initialization
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const logout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    // Remove the 'token' cookie
    Cookies.remove('token');
    // Reset the user state to an empty object
    setUser({});

    nav('/login');
  };

  // Effect to update local storage whenever user object changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', JSON.stringify(user.token))
    // Set user.token in cookies
    if (user && user.token) {
      Cookies.set('token', user.token, { expires: 7 }); // 'expires' sets cookie expiration to 7 days
    } else {
      // If there is no user or token, remove the cookie
      Cookies.remove('token');
    }
  }, [user]);

const [commonApi, setCommonApi] = useState({})

useEffect(() => {
  axios.post('/Marie-ERP/api/common', { userId : user.userId })
  .then(response => {
    console.log(response, '565')
     setCommonApi(response.data.Data[0])
    
  })
  .catch(error => console.log(error, 'common api error'))
},[user])

  return (
    <UserContext.Provider value={{user, setUser, logout, commonApi}}>
      {children}
    </UserContext.Provider>
  )
}

export default GlobalContext