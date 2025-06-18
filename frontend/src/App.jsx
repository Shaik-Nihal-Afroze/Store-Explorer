import React, { useEffect } from 'react';

import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';

import {Routes, Route, Navigate} from 'react-router-dom';

import { ClipLoader } from 'react-spinners';


import { useAuthStore } from './store/useAuthStore';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';

import LoginPage from './pages/LoginPage';

import SignupPage from './pages/SignUpPage';


import StoreOwner from './pages/StoreOwnerPage';

import "./index.css"

const App =() => {
  const {authUser, isCheckingAuth, checkAuth} = useAuthStore();

  

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  // console.log({authUser})


  if (isCheckingAuth && !authUser){
    return (
      <div className='loader-container'>
        <h1 className='loader-heading'>Please Wait ,It seems like the app is taking around 10 to 15 seconds to load... </h1>
        <ClipLoader color="#123abc" size={50} />;
      </div>
    )
  }


  return (
    <>
      <Routes>
        <Route path="/" element={!authUser ? <Navigate to="/login"/> :<Navigate to={`/${authUser.role.toLowerCase()}`}/> } />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to={`/${authUser.role.toLowerCase()}`}/>}/>
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to={`/${authUser.role.toLowerCase()}`}/>}/>
        <Route path="/user" element={authUser?.role === 'User' ? <UserPage/> : <Navigate to="/login"/> }/>
        <Route path="/admin" element={authUser?.role === 'Admin' ? <AdminPage/> : <Navigate to="/login"/> }/>
        <Route path="/owner" element={authUser?.role === 'Owner' ? <StoreOwner/> : <Navigate to="/login"/> }/>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
