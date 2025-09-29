"use client";

import { useState } from "react";
import { serviceExecuter } from "@/lib/serviceExecuter";

export function useLogin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true)
    const res = await serviceExecuter(
      { email, password },
      "login",
      "POST",
      "login service"
    );
    setData(res);
    setLoading(false)
  };

  return { data, login, loading };
}
