// UserContext.js
import {auth} from '../config/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [students, setStudents] = useState([])
  const logIn = (email,password)=> {
    return signInWithEmailAndPassword(auth, email, password)
  }

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth , (currentUser )=> {
      setUser(currentUser?.email)
    })
    return ()=> unsubscribe()
  },[])

  return (
    <UserContext.Provider value={{ user,  setUser , logIn , students , setStudents}}>
      {children}
    </UserContext.Provider>
  );
};
