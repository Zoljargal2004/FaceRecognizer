"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm({ onBack }) {
  const handleSubmit = async () => {};
  const [email, setEmail] = useState("");
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <label className="font-bold" htmlFor="email">
            Email
          </label>
          <Input
            type={"email"}
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button  type="submit" className="w-full mt-4" 
          // disabled={}
          >
            {/* {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : ( */}
              "Send Reset Instructions"
            {/* )} */}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
