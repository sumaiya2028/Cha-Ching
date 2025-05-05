import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "../hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        console.log("Received token from URL:", token);

        if (token) {
          try {
            const payloadBase64 = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            console.log("Decoded JWT Payload:", decodedPayload);

            const { name, picture } = decodedPayload;
            console.log("Decoded name:", name);
            console.log("Decoded picture:", picture);
            if (name && picture) {
              const userInfo = { name, picture };
              setUser(userInfo);

              // Save both token and userInfo for persistence
              localStorage.setItem("token", token);
              localStorage.setItem("userInfo", JSON.stringify(userInfo));

              console.log("Token and userInfo saved to localStorage");
            }

            toast({
              title: "Success",
              description: "Successfully logged in!",
            });

            navigate("/dashboard");
          } catch (error) {
            console.error("Error decoding payload or saving data:", error);
            toast({
              title: "Error",
              description: `Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
              variant: "destructive",
            });
            setTimeout(() => navigate("/login"), 3000);
          }
        } else {
          console.error("No token received in URL.");
          toast({
            title: "Error",
            description: "Authentication failed. No token received.",
            variant: "destructive",
          });
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error: any) {
        console.error("Error during OAuth callback:", error);
        toast({
          title: "Error",
          description: `Authentication failed: ${error.message || "Unknown error"}`,
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleOAuthCallback();
  }, [location, navigate, setUser]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 text-3xl font-bold text-indigo-600">
          <svg
            className="mx-auto h-12 w-12 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Logging you in...</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
