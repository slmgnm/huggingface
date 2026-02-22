"use client";
import { use } from "react";
import Resume from "./resume/page";
import { useAppContext } from "@/context/AppContext";
import NavBar from "./components/NavBar";

export default function Home() {
  const { state, theme } = useAppContext();
  console.log("state", state);
  return (
    <main data-theme={theme} className="flex min-h-screen flex-col items-center justify-between bg-base-300">
      <NavBar />
      <Resume />
    </main>
  );
}
