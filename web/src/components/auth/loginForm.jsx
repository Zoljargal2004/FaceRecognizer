"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useLogin } from "@/services/login";
import { toast } from "sonner";

export default function LoginForm({ onToggleMode, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, login, loading } = useLogin();
  useEffect(() => {
    if (data) {
      toast(data.error || data.message);
      if (data.token) {
        cookieStore.set("bearer", data.token);
      }
    }
  }, [data]);
  const handleLogin = () => {
    if (!email || !password) {
      toast("Email and password cannot be empty");
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Please enter a valid email address");
      return;
    }
    login(email, password);
  };

  return (
    <Card className="p-4 ">
      <form className="flex flex-col gap-4 justify-center align-bottom" onSubmit={(e) => e.preventDefault()}>
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
        <Button type="submit" disabled={loading} onClick={() => handleLogin()}>
          {(loading && (
            <div className="flex gap-2 items-center">
              <Loader2 className="animate-spin" size={14} />
              <Label>Loading</Label>
            </div>
          )) || <Label>Login</Label>}
        </Button>
      </form>
      <div className="text-center space-y-2">
        <Button
          type="button"
          variant="link"
          onClick={onForgotPassword}
          className="text-sm"
        >
          Forgot your password?
        </Button>
        <div className="text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Button
            type="button"
            variant="link"
            onClick={onToggleMode}
            className="p-0 h-auto font-medium"
          >
            Sign up
          </Button>
        </div>
      </div>
    </Card>
  );
}
