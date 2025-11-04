import React, { createContext, useState } from "react";
import { getAccessTokenFromLS, getProfileFromLS } from "../utils/auth";
import type { SimpleProfile } from "../types/user.type";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: SimpleProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<SimpleProfile | null>>;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [profile, setProfile] = useState<SimpleProfile | null>(
    initialAppContext.profile as SimpleProfile | null
  );

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
