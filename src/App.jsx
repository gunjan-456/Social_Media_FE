import React, { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Profile from "./Components/Profile";
import Chats from "./Components/Chats";
import NewPost from "./Components/NewPost";
import EditProfile from "./Components/EditProfile";
import EditPassword from "./Components/EditPassword";
import ViewProfile from "./Components/ViewProfile";
import Requests from "./Components/Requests";
import ChatBox from "./Components/ChatBox";

export const uiContext = createContext(null);

const App = () => {
  const [ui, setUi] = useState(0);
  const [email, setEmail] = useState("");

  return (
    <uiContext.Provider value={{ ui, setUi, email, setEmail }}>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:id" element={<ChatBox />} />
          <Route path="/add" element={<NewPost />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/edit/password" element={<EditPassword />} />
          <Route path="/profile/view/:userId" element={<ViewProfile />} />
          <Route path="/review-requests" element={<Requests />} />
        </Route>
      </Routes>
    </uiContext.Provider>
  );
};

export default App;
