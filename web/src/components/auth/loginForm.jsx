"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/services/login";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, login, loading } = useLogin();
  console.log(data);

  const handleLogin = () => {
    login(email, password);
  };

  return (
    <Card className="p-4 flex flex-col gap-4 justify-center align-bottom">
      <div className="flex flex-col gap-4">
        <Label className="font-bold" htmlFor="email">
          Email
        </Label>
        <Input
          type={"email"}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label className="font-bold" htmlFor="Password">
          Password
        </Label>
        <Input
          type={"password"}
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button disabled={loading} onClick={() => handleLogin()}>
        {(loading && (
          <div className="flex gap-2 items-center">
            <Loader2 className="animate-spin" size={14} />
            <Label>Loading</Label>
          </div>
        )) || <Label>Login</Label>}
      </Button>
    </Card>
  );
}
