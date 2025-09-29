"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/loginForm";
import ForgotPasswordForm from "@/components/auth/forgotPassword";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  console.log(mode)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">FitTracker</h1>
          <p className="text-muted-foreground">
            Your fitness journey starts here
          </p>
        </div>
        {mode == "login" && (
          <LoginForm
            onToggleMode={() => setMode("signup")}
            onForgotPassword={() => setMode("forgot-password")}
          />
        )}

      

        {/* {mode == "signup" && <SignupForm onToggleMode={() => setMode("login")} />} */}

        {mode === "forgot-password" && <ForgotPasswordForm onBack={() => setMode("login")} />}
      </div>
    </div>
  );
}
