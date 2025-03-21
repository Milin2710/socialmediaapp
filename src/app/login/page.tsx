"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Set withCredentials to true to allow cookies to be sent
      const response = await axios.post(
        "http://localhost:3002/auth/login", 
        { email, password },
        { withCredentials: true } // Important for cookies
      );
      
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
        />
        <Button className="btn btn-primary w-full cursor-pointer">Login</Button>
      </form>
    </div>
  );
};

export default Login;
