import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import { register } from '../../lib/api/user.api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await register(formData);
      toast.success(res.message);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign Up | User Authentication</title>
      </Helmet>

      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 min-h-fit">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Sign Up
          </h2>

          <form onSubmit={handleSubmit} className="mt-4">
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-700 dark:text-white`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-700 dark:text-white`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-700 dark:text-white`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition">
              Register
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
            Already have an account?
            <Link to="/sign-in" className="text-blue-500 dark:text-blue-400 hover:underline ml-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
