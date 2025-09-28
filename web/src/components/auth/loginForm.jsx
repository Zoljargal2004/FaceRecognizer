"use client"

import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card className="p-4 flex flex-col gap-4 justify-center align-bottom">
      <div className="flex flex-col gap-4">
        <Label className="font-bold" htmlFor="email">
          Email
        </Label>
        <Input type={"email"} placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex flex-col gap-4">
        <Label className="font-bold" htmlFor="Password">
          Password
        </Label>
        <Input type={"password"} placeholder="Enter your Password" onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <Button onClick={console.log(email, password)}>Login</Button>
    </Card>
  );
}

