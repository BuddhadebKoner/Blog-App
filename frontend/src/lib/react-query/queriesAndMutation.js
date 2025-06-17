import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { QUERY_KEYS } from "./QueryKeys";
import { isAuthenticated, sendVerifyOtp, varifyEmail } from "../api/auth.api.js";
import { getUser, getUserById, login, logOut, updateUser } from "../api/user.api.js";
import { createBlog, deleteBlog, getAllBlogs, getAllBlogsByUserId, getBlogById, getRecentThreeBlogs, updateBlog } from "../api/blog.api.js";

// send verify otp
export const useSendVerifyOtp = () => {
   return useMutation({
      mutationKey: [QUERY_KEYS.SEND_VERIFY_OTP],
      mutationFn: sendVerifyOtp,
      onError: (error) => {
         toast.error(error.message || "Failed to send verification OTP");
      }
   });
};

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
      refetchOnWindowFocus: false,
   });
};

// get user by id params
export const useGetUserById = (id) => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
      queryFn: () => getUserById(id),
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

// update blog
export const useUpdateBlog = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationKey: [QUERY_KEYS.UPDATE_BLOG],
      mutationFn: ({ slugParam, blogData }) => updateBlog(slugParam, blogData),
      onSuccess: (data) => {
         if (data.success) {
            queryClient.invalidateQueries([QUERY_KEYS.GET_BLOGS]);
            queryClient.invalidateQueries([QUERY_KEYS.GET_BLOG_BY_ID]);
            queryClient.invalidateQueries([QUERY_KEYS.GET_ALL_BLOGS_BY_USER_ID]);
            toast.success('Blog updated successfully!');
         }
      },
      onError: (error) => {
         toast.error(error.response?.data?.message || "Failed to update blog");
      }
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

// get recent three blogs
export const useGetRecentBlogs = () => {
   return useQuery({
      queryKey: [QUERY_KEYS.GET_RECENT_BLOGS],
      queryFn: getRecentThreeBlogs,
      refetchOnWindowFocus: false,
   });
};