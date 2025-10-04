import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  console.log("🚀 Root page loaded");
  
  const session = await auth();
  console.log("🔑 Session result:", session);

  // DIRECT REDIRECT - NO INTERMEDIATE PAGES
  if (session) {
    console.log("✅ User authenticated, redirecting to operations");
    redirect("/operations");
  } else {
    console.log("❌ User not authenticated, redirecting to login");
    redirect("/login");
  }
}