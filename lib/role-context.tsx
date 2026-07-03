import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "worker" | "community-guardian" | "business" | "consumer";

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load role from storage on mount
  useEffect(() => {
    const loadRole = async () => {
      try {
        const savedRole = await AsyncStorage.getItem("userRole");
        if (savedRole && isValidRole(savedRole)) {
          setRoleState(savedRole as UserRole);
        }
      } catch (error) {
        console.error("Failed to load user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRole();
  }, []);

  const setRole = async (newRole: UserRole) => {
    try {
      await AsyncStorage.setItem("userRole", newRole);
      setRoleState(newRole);
    } catch (error) {
      console.error("Failed to save user role:", error);
      throw error;
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

function isValidRole(role: string): role is UserRole {
  return ["worker", "community-guardian", "business", "consumer"].includes(role);
}
