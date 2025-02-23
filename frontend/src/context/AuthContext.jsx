import { createContext, useContext, useState, useEffect } from "react";
import { useIsAuthenticated } from "../lib/react-query/queriesAndMutation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [currentUser, setCurrentUser] = useState(null);

   // Fetch authentication status
   const {
      data: isAuthenticatedData,
      isLoading: isAuthenticatedLoading,
      error: isAuthenticatedError
   } = useIsAuthenticated();

   // Update authentication state when data changes
   useEffect(() => {
      if (isAuthenticatedData?.success) {
         console.log("isAuthenticatedData", isAuthenticatedData);
         setCurrentUser(isAuthenticatedData?.data);
         setIsAuthenticated(true);
      } else {
         setIsAuthenticated(false);
      }
   }, [isAuthenticatedData]);

   return (
      <AuthContext.Provider value={{ isAuthenticated, isAuthenticatedLoading, isAuthenticatedError, currentUser }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
