import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./QueryKeys";
import { isAuthenticated, varifyEmail } from "../api/auth.api";
import { logOut } from "../api/user.api";

// varify email with otp 
export const useVerifyEmail = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationKey: [QUERY_KEYS.VERIFY_EMAIL],
      mutationFn: varifyEmail,
      onSuccess: () => {
         queryClient.invalidateQueries([QUERY_KEYS.IS_AUTHENTICATED]);
      }
   });
};

// is authenticated ?
export const useIsAuthenticated = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.IS_AUTHENTICATED],
      queryFn: isAuthenticated,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
   });
};

// logout
export const useLogOut = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationKey: [QUERY_KEYS.LOGOUT],
      mutationFn: logOut,
      onSuccess: () => {
         queryClient.invalidateQueries([QUERY_KEYS.IS_AUTHENTICATED]);
      }
   });
};