import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./QueryKeys";
import { isAuthenticated, varifyEmail } from "../api/auth.api.js";
import { getUser, getUserById, login, logOut, updateUser } from "../api/user.api.js";
import { createBlog, deleteBlog, getAllBlogs, getAllBlogsByUserId, getBlogById } from "../api/blog.api.js";

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

// login
export const useLogin = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationKey: [QUERY_KEYS.LOGIN],
      mutationFn: login,
      onSuccess: (data) => {
         if (data.success) {
            queryClient.invalidateQueries([QUERY_KEYS.IS_AUTHENTICATED]);
         }
      },
      onError: (error) => {
         toast.error(error.response?.data?.message || "Something went wrong");
      }
   });
};

// get user
export const useGetUser = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_USER],
      queryFn: getUser,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
   });
};

// get user by id params
export const useGetUserById = (id) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
      queryFn: () => getUserById(id),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
   });
};

// create blog
export const useCreateBlog = () => {

   const queryClient = useQueryClient();

   return useMutation({
      mutationKey: [QUERY_KEYS.CREATE_BLOG],
      mutationFn: createBlog,
      onSuccess: (data) => {
         if (data.success) {
            queryClient.invalidateQueries([QUERY_KEYS.GET_BLOGS]);
         }
      },
      onError: (error) => {
         toast.error(error.response?.data?.message || "Something went wrong");
      }
   });
};

// React Query hook for blogs with infinite scrolling
export const useGetAllBlogsByUserId = (id, limit = 5) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_BLOGS_BY_USER_ID, id, limit],
      queryFn: ({ pageParam = 1 }) => getAllBlogsByUserId(id, pageParam, limit),
      getNextPageParam: (lastPage) => {
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      refetchOnWindowFocus: false,
      enabled: !!id,
   });
};

// get blog for infinite scrolling
export const useGetAllBlogs = (limit = 5) => {
   return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_ALL_BLOGS, limit],
      queryFn: ({ pageParam = 1 }) => getAllBlogs(pageParam, limit),
      getNextPageParam: (lastPage) => {
         if (lastPage.currentPage < lastPage.totalPages) {
            return lastPage.currentPage + 1;
         }
         return undefined;
      },
      refetchOnWindowFocus: false,
   });
};

// get blog by id
export const useGetBlogById = (id) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_BLOG_BY_ID, id],
      queryFn: () => getBlogById(id),
      refetchOnWindowFocus: false,
   });
}

// update user
export const useUpdateUser = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateUser,
      onSuccess: (data) => {
         // Update the user data in cache
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER] });
      },
   });
};

// delete blog
export const useDeleteBlog = () => { 
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteBlog,
      onSuccess: (data) => {
         if (data.success) {
            queryClient.invalidateQueries([QUERY_KEYS.GET_BLOGS]);
         }
      },
   });
};