import { useEffect, useState } from "react";
import "./App.css";
import "./global.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { SigninFrom } from "./_auth/forms/SigninFrom";
import { Home } from "./_root/pages/Home";

import { AuthLayout } from "./_auth/AuthLayout";
import { RootLayout } from "./_root/RootLayout";
import { SignupForm } from "./_auth/forms/SignupForm";
import { Toaster } from "@/components/ui/toaster";
import Explore from "./_root/pages/Explore";
import Saved from "./_root/pages/Saved";
import AllUsers from "./_root/pages/AllUsers";
import { CreatePost } from "./_root/pages/CreatePost";
import PostDetail from "./_root/pages/PostDetail";
import EditPost from "./_root/pages/EditPost";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event: any) => {
      if (
        localStorage.getItem("cookieFallback") === "[]" ||
        localStorage.getItem("cookieFallback") === null
      ) {
        navigate("/sign-in");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  return (
    <>
      <main className="flex h-screen">
        <Routes>
          {/* public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-up" element={<SignupForm />} />
            <Route path="/sign-in" element={<SigninFrom />} />
          </Route>

          {/* private routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
          </Route>
        </Routes>
        <Toaster />
      </main>
    </>
  );
}

export default App;
