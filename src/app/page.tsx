import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  // DIRECT REDIRECT - NO INTERMEDIATE PAGES
  if (session) {
    redirect("/operations");
  } else {
    redirect("/login");
  }
}