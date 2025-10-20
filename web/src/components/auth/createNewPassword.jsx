"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import useResetPassword from "@/services/createNewPassword";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

export default function CreateNewPassword(token) {
  const { loading, data, resetPassword } = useResetPassword();
  const {email} = jwtDecode(token.token)
  const [password, setPassword] = useState()

  useEffect(()=>{
    if(!data) return
    else if(data.error) {
        toast(data.error)
        return
    }
    else{
        return data.message
    }
  },[data])

  const handleSubmit =  () => {
    const retype = document.getElementById("retype")
    if(retype.value != password){
        toast("Шинэ нууц үг дахин бичсэнтэй таарахгүй байна.")
        return
    }
    else{
        resetPassword(email, password, token)
    }
  }
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="font-bold" htmlFor="email">
            Write the new password here
          </label>
          <Input
            type={"password"}
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="font-bold" htmlFor="email">
            Retype the new password
          </label>
          <Input
            id="retype"
            type={"password"}
            placeholder="Retype the password"
          />
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
