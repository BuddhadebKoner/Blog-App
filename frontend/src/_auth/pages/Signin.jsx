import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { LoaderCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../../lib/react-query/queriesAndMutation';

const Signin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { mutate: login } = useLogin();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    login(formData, {
      onSuccess: (data) => {
        setLoading(false);
        if (data.success) {
          toast.success("Login successful");
          navigate("/");
        } else {
          toast.error(data.message || "Something went wrong");
        }
      },
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign In | User Authentication</title>
      </Helmet>

      {loading ? (
        <div className="w-full h-full flex justify-center items-center bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
          <LoaderCircle className='animate-spin w-10 h-10' />
        </div>
      ) : (
        <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
          <h2 className="text-2xl font-bold text-center mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
            Welcome Back
          </h2>
          <form onSubmit={handleSubmit} className="mt-4">
            {/* Form fields remain the same */}
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
            <div className="mb-4">
              <label className="block mb-1 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
                         dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)]
                         dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)]
                         dark:focus:ring-[var(--color-accent-dark)]"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md 
                       hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)] transition cursor-pointer"
            >
              Sign in
            </button>
          </form>
          {/* Links remain the same */}
          <p className="mt-4 text-center text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
            Don't have an account ?
            <Link to="/sign-up" className="text-blue-500 dark:text-blue-400 hover:underline ml-1">
              Sign Up
            </Link>
          </p>
          <p className='mt-4 text-center text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]'>
            <Link to="/forgot-password" className="text-blue-500 dark:text-blue-400 hover:underline ml-1">
              Forgot Password
            </Link>
          </p>
        </div>
      )}
    </>
  );
};

export default Signin;