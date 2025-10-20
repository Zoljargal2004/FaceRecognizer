"use client";

import { useState } from "react";
import { serviceExecuter } from "@/lib/serviceExecuter";

export function useSentEmail() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendEmail = async (email) => {
    setLoading(true)
    const res = await serviceExecuter(
      { email },
      "createNewPassword",
      "POST",
      "email token request"
    );
    setData(res);
    setLoading(false)
  };

  return { data, sendEmail, loading };
}
