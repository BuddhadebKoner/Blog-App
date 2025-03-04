import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { register } from '../../lib/api/user.api';
import Otp from '../../components/Otp';
import { LoaderCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await register(formData);
      if (!res.data.userID || !res.data.email) {
        setLoading(false);
        toast.error("Something went wrong");
        return;
      }
      toast.success("Verification code sent to email");
      setLoading(false);
      setResponseData(res.data);
      setIsOtpOpen(true);
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | Secure Authentication</title>
      </Helmet>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 rounded-lg shadow-md bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        {isOtpOpen ? (
          <Otp
            setIsOtpOpen={setIsOtpOpen}
            userID={responseData.userID}
            email={responseData.email}
            setLoading={setLoading}
            action="register"
          />
        ) : loading ? (
          <>
            <div className="w-full h-40 sm:h-48 flex justify-center items-center bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
              <LoaderCircle className='animate-spin w-8 h-8 sm:w-10 sm:h-10' />
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
              Create Account
            </h2>
            <form onSubmit={handleSubmit} className="mt-3 sm:mt-4">
              <div className="mb-3 sm:mb-4">
                <label className="block mb-1 text-sm sm:text-base text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 text-sm sm:text-base border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)]"
                />
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
              </div>
              <div className="mb-3 sm:mb-4">
                <label className="block mb-1 text-sm sm:text-base text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm sm:text-base border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)]"
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="mb-3 sm:mb-4">
                <label className="block mb-1 text-sm sm:text-base text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 text-sm sm:text-base border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)]"
                />
                {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md text-sm sm:text-base hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)] transition"
              >
                Register
              </button>
            </form>
            <p className="mt-4 text-center text-xs sm:text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
              Already have an account ?
              <Link to="/sign-in" className="text-blue-500 dark:text-blue-400 hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default Signup;