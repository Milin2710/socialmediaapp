"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [user_id, setUserid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/auth/signup", { user_id, email, password });
      toast.success("Signup successful! Please login.");
      window.location.href = "/login"; // Redirect to login after successful signup
    } catch (err) {
      console.error("Signup failed", err);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Username"
          value={user_id}
          onChange={(e) => setUserid(e.target.value)}
          className="input input-bordered w-full"
        />
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
        <Button className="btn btn-primary w-full">Signup</Button>
      </form>
    </div>
  );
};

export default Signup;
