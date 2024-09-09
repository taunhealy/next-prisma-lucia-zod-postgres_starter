import { SignInForm } from "@/features/auth/components/sign-in-form";
import signIn from "@/features/auth/actions/sign-in";

export default function SignInPage() {
  // @ts-ignore
  return <SignInForm action={signIn} />;
}
