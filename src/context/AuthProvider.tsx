import { ReactNode, useEffect, useState } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    // Step 1: Try to load userInfo from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUser = JSON.parse(storedUserInfo);
        if (parsedUser.name && parsedUser.picture) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse userInfo from localStorage:", error);
      }
    } else {
      // Step 2: Fallback – decode user from JWT if token exists
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payloadBase64 = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          const { name, picture } = decodedPayload;
          if (name && picture) {
            const userInfo = { name, picture };
            setUser(userInfo);
            localStorage.setItem("userInfo", JSON.stringify(userInfo)); // Cache it for next time
          }
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
