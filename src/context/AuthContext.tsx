import { useToast } from "@/components/ui/use-toast";
import { getCurrentUser, saveUserGoogleToDB } from "@/lib/appWrite/api";
import { account } from "@/lib/appWrite/config";
import { IContextType, IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // console.log("createContext");

    // if (
    //   localStorage.getItem("cookieFallback") === "[]" ||
    //   localStorage.getItem("cookieFallback") === null
    // ) {
    //   creatAccountGoogle();
    //   navigate("/sign-in");
    // }
    // checkAuthUser();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await creatAccountGoogle();

      if (
        localStorage.getItem("cookieFallback") === "[]" ||
        localStorage.getItem("cookieFallback") === null
      ) {
        navigate("/sign-in");
      }

      checkAuthUser();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const creatAccountGoogle = async function creatAccountGoogle() {
    try {
      const session = await account.getSession("current");

      if (session && session.provider === "google") {
        const newUser = await saveUserGoogleToDB();

        if (!newUser) {
          toast({ title: "Create user failed" });
          return;
        }
        const token = await account.createJWT();

        if (token) {
          const cookie = localStorage.getItem("cookieFallback");

          if (cookie == null || cookie === "[]") {
            localStorage.setItem("cookieFallback", token.jwt);
          }
        }
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };
  const checkAuthUser = async () => {
    try {
      const currentaccount = await getCurrentUser();

      if (currentaccount) {
        setUser({
          id: currentaccount.$id,
          name: currentaccount?.name,
          username: currentaccount.username,
          email: currentaccount.email,
          imageUrl: currentaccount.imageURL,
          bio: currentaccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: IContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserContext = () => useContext(AuthContext);
