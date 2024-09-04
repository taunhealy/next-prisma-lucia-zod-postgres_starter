"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import signIn from "../actions/sign-in";

export const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);

    if (result.success) {
      console.log("Redirecting to /dashboard");
      router.push("/dashboard");
    } else {
      setError(result.error ?? "An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 p-4">
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign In</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};
