"use client";

import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const checkToken = async () => {
    const token = await cookieStore.get("bearer");

    if (!token) {
      router.push("/login");
      return;
    }
  };

  useEffect(() => {
    checkToken();
  }, [router]);
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
