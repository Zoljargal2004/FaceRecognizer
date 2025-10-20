"use client";

import { useState } from "react";
import { serviceExecuter } from "@/lib/serviceExecuter";

export default function useResetPassword() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (email, password, token) => {
    setLoading(true)
    const res = await serviceExecuter(
      { email, password, token : token.token },
      "createNewPassword",
      "PUT",
      "change pawword with token request",
    );
    setData(res);
    setLoading(false)
  };

  return { data, resetPassword, loading };
}
