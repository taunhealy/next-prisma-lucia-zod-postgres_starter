"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

type SignInResult = {
  success: boolean;
  error?: string;
  toast?: {
    title: string;
    description: string;
    type: "error" | "success";
  };
};

const signIn = async (formData: FormData): Promise<SignInResult> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Received form data:", { email, password: "***" });

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
      toast: {
        title: "Sign In Failed",
        description: "Please provide both email and password.",
        type: "error",
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error("User not found");
      return {
        success: false,
        error: "User not found",
      };
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, "sha512")
      .toString("hex");

    if (hashedPassword !== user.hashedPassword) {
      console.error("Invalid password");
      return {
        success: false,
        error: "Incorrect email or password",
        toast: {
          title: "Sign In Failed",
          description: "The provided password is incorrect.",
          type: "error",
        },
      };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    console.log("Redirecting to /dashboard");
    redirect("/dashboard");
  } catch (error) {
    console.error("Error during sign-in:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
      toast: {
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      },
    };
  }
};

export default signIn;
