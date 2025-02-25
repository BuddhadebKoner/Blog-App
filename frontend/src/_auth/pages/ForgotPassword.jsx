import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

const ForgotPassword = () => {

   const [formData, setFormData] = useState({ email: '' });
   const [errors, setErrors] = useState({});

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const validateForm = () => {
      let newErrors = {};
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      console.log("Sign in data:", formData);
      // Add your API call here later...
   };

   return (
      <>
         <Helmet>
            <meta charSet="utf-8" />
            <title>Forgot Password | User Authentication</title>
         </Helmet>
         <div className="w-full max-w-md p-6 mx-auto my-10 rounded-lg shadow-md bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
            <h2 className="text-2xl font-bold text-center mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
               Forgot Password
            </h2>
            <form onSubmit={handleSubmit} className="mt-4">
               <div className="mb-4">
                  <label className="block mb-1 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                     Email
                  </label>
                  <input
                     type="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     placeholder="Enter your email"
                     className="w-full px-3 py-2 border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                           dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)]
                           dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)]
                           dark:focus:ring-[var(--color-accent-dark)]"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
               </div>
               <button
                  type="submit"
                  className="w-full bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md 
                         hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)] transition cursor-pointer"
               >
                  Send Reset OTP
               </button>
            </form>
         </div>
      </>
   )
}

export default ForgotPassword;