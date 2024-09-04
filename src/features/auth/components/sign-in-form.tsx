"use client";

import { useState } from "react";
import signIn from "../actions/sign-in";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signIn(formData);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error ?? "An unknown error occurred");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="absolute left-0 right-0 top-0 mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <strong className="font-bold">Sign In Failed:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-2 p-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="rounded border p-2"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded bg-blue-500 p-2 text-white transition-colors duration-300 hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
