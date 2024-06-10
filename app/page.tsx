"use client";
import { use } from "react";
import Resume from "./resume/page";
import { useAppContext } from "@/context/AppContext";
import NavBar from "./components/NavBar";

export default function Home() {
  const { state } = useAppContext();
  console.log("state", state);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between ">
      <NavBar />
      <Resume />
    </main>
  );
}
