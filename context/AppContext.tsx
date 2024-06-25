"use client";
import React, { createContext, useState, ReactNode, useContext } from "react";
import "react-quill/dist/quill.snow.css";

interface AppContextProps {
  state: any;
  theme: string;
  setState: React.Dispatch<React.SetStateAction<any>>;

  changeTheme: (event?: any) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<any>(() => {
    null;
  });
  const [theme, setTheme] = useState<string>("luxury");
  const changeTheme = (event?: any) => {
    const nextTheme: string | null = event.target.value || null;
    if (nextTheme) {
      setTheme(nextTheme);
    } else {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    }
  };

  console.log("state", state);
  console.log("theme", theme);

  return (
    <AppContext.Provider value={{ state, setState, theme, changeTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
