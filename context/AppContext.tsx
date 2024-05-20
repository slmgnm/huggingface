"use client";
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface AppContextProps {
  state: any;
  setState: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<any>(() => {
    const localData = localStorage.getItem('appState');
    return localData ? JSON.parse(localData) : null;
  });

  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  console.log("state", state);

  return (
    <AppContext.Provider value={{ state, setState }}>
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
