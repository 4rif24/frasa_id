
// src/utilities/providers/AuthProvider.jsx  (sesuaikan path)
import React, { createContext, useEffect, useState } from 'react';
import { app } from '../../config/firebase.init';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import useAxiosFetch from '../../hooks/useAxiosFetch'; // path sesuai struktur

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState("");
  const auth = getAuth(app);
  const axiosFetch = useAxiosFetch();

  const signUp = async (email, password) => {
    try {
      setLoader(true);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.code);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setLoader(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.code);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setLoader(true);
      await signOut(auth);
      localStorage.removeItem('access-token');
      setUser(null);
      setLoader(false);
    } catch (err) {
      setError(err.code);
      throw err;
    }
  };

  const updateUser = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setUser(auth.currentUser);
    } catch (err) {
      setError(err.code);
      throw err;
    }
  };

  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async () => {
    try {
      setLoader(true);
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.code);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (usr) {
        // request token from backend and store it
        axiosFetch.post('/set-token', { email: usr.email, name: usr.displayName })
          .then((res) => {
            const token = res.data?.token;
            if (token) {
              localStorage.setItem('access-token', token);
            }
            setLoader(false);
          })
          .catch((err) => {
            console.error('set-token error', err);
            localStorage.removeItem('access-token');
            setLoader(false);
          });
      } else {
        localStorage.removeItem('access-token');
        setLoader(false);
      }
    });

    return () => unsubscribe();
  }, []); // eslint-disable-line

  const contextValue = {
    user,
    signUp,
    login,
    logout,
    updateUser,
    googleLogin,
    error,
    setError,
    loader,
    setLoader,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
