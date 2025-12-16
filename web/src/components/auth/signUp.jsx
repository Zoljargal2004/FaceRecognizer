"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSignup } from "@/services/signUp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupForm({ onToggleMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const { data, login, loading } = useSignup();
  useEffect(() => {
    if (data) {
      toast(data.error || data.message);
    }
    if (data?.message) {
      router.push("/");
    }
  }, [data]);
  const handleSignup = () => {
    if (!email || !password) {
      toast("Email эсвэл нууц үг буруу байна.");
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Email алдаатай байна.");
      return;
    }
    login(email, password, name);
  };

  return (
    <Card className="p-4 ">
      <Label className="font-bold text-2xl text-center" htmlFor="email">
        Шинэ хэрэглэгч
      </Label>
      <form
        className="flex flex-col gap-4 justify-center align-bottom"
        onSubmit={(e) => e.preventDefault()}
      >
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
          <Label className="font-bold" htmlFor="email">
            Нэр
          </Label>
          <Input
            type={"name"}
            placeholder="Нэр"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Label className="font-bold" htmlFor="Password">
            Нууц үг
          </Label>
          <Input
            type={"password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading} onClick={() => handleSignup()}>
          {(loading && (
            <div className="flex gap-2 items-center">
              <Loader2 className="animate-spin" size={14} />
              <Label>Уншиж байна</Label>
            </div>
          )) || <Label>Бүртгүүлэх</Label>}
        </Button>
      </form>
      <Button
        type="button"
        variant="ghost"
        onClick={onToggleMode}
        className="w-full"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Нэвтрэх зэс рүү буцах
      </Button>
    </Card>
  );
}
