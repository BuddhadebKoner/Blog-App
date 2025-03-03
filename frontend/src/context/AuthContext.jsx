import { createContext, useContext, useState, useEffect } from "react";
import { useIsAuthenticated } from "../lib/react-query/queriesAndMutation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);
   const [serverStatus, setServerStatus] = useState({ isRunning: true, message: null });

   // Fetch authentication status
   const {
      data: isAuthenticatedData,
      isLoading: isAuthenticatedLoading,
      error: isAuthenticatedError
   } = useIsAuthenticated();

   // Check for server availability based on error
   useEffect(() => {
      // First check for network errors (server is off)
      if (isAuthenticatedError) {
         // These errors will only appear if they're thrown from the isAuthenticated function
         setServerStatus({
            isRunning: false,
            message: "Server is currently unavailable. Please check if the server is running."
         });
      } else if (isAuthenticatedData) {
         // We got a response, so the server is running
         if (isAuthenticatedData.success) {
            setCurrentUser(isAuthenticatedData.data);
            setIsAuthenticated(true);
         } else {
            setIsAuthenticated(false);
            setCurrentUser(null);
         }
         // Since we got a response (even an error response), the server is running
         setServerStatus({ isRunning: true, message: null });
      }
   }, [isAuthenticatedData, isAuthenticatedError]);

   return (
      <AuthContext.Provider
         value={{
            isAuthenticated,
            isAuthenticatedLoading,
            isAuthenticatedError,
            currentUser,
            serverStatus
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);