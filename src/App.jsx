import React, { useEffect, useState } from "react";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";
import DashBoard from "./components/DashBoard/DashBoard";
import Navbar from "./components/navbar/Navbar";
import Loader from "./components/loader/Loader";
import "./App.css";
import CommunityInfo from "./components/communityInfo/CommunityInfo";
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents flashing login page

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed: ", auth);
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader />; // Avoids flicker before Firebase updates auth state
  }

  return (
    <BrowserRouter>
      {currentUser && <Navbar />}
      <Routes>
        {/* Conditional Route for Home Page */}
        <Route path="/" element={currentUser ? <DashBoard /> : <Login />} />

        {/* Protected Routes (Only if logged in) */}
        {currentUser && (
          <>
            <Route path="/communityInfo" element={<CommunityInfo />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
