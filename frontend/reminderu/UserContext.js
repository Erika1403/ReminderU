import React, { createContext, useState, useContext } from 'react'

export const UserContext = createContext();
export const UserContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [schedData, setSchedData] = useState("");
    const [schedToday, setSchedToday] = useState([{timeStr: '', Title: 'You have no reminder for today!'}]);
    return (
      <UserContext.Provider value={{ userData, setUserData, schedData, setSchedData, schedToday, setSchedToday }}>
        {children}
      </UserContext.Provider>
    );
  };
export const useUserContext = () => useContext(UserContext);