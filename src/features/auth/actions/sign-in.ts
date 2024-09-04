"use server";

import { cookies } from "next/headers";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";

const signIn = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("Received form data:", { email, password: "***" });

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.error("User not found");
      return { success: false, error: "Incorrect email or password" };
    }

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password,
    );

    if (!validPassword) {
      console.error("Invalid password");
      return { success: false, error: "Incorrect email or password" };
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    console.log("Sign-in successful");
    return { success: true };
  } catch (error) {
    console.error("Error during sign-in:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

export default signIn;
