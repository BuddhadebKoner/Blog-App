import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { sendResetOtp, resetPassword } from '../../lib/api/auth.api';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
   const [formData, setFormData] = useState({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
   });
   const [errors, setErrors] = useState({});
   const [step, setStep] = useState('email'); // email, otp, success
   const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
   const [isResending, setIsResending] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [message, setMessage] = useState({ type: '', text: '' });
   const timerRef = useRef(null);

   useEffect(() => {
      return () => {
         if (timerRef.current) clearInterval(timerRef.current);
      };
   }, []);

   const startTimer = () => {
      // Clear any existing timer
      if (timerRef.current) clearInterval(timerRef.current);

      // Reset timer to 5 minutes (300 seconds)
      setTimeLeft(300);

      // Start countdown
      timerRef.current = setInterval(() => {
         setTimeLeft(prev => {
            if (prev <= 1) {
               clearInterval(timerRef.current);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
   };

   const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
   };

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      // Clear errors when user types
      if (errors[e.target.name]) {
         setErrors(prev => ({ ...prev, [e.target.name]: '' }));
      }
   };

   const validateEmailForm = () => {
      let newErrors = {};
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const validateOtpForm = () => {
      let newErrors = {};
      if (!formData.otp.trim()) newErrors.otp = "OTP is required";
      else if (!/^\d{6}$/.test(formData.otp)) newErrors.otp = "OTP must be 6 digits";

      if (!formData.newPassword.trim()) newErrors.newPassword = "New password is required";
      else if (formData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";

      if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
      else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSendOtp = async (e) => {
      e.preventDefault();
      if (!validateEmailForm()) return;

      try {
         setIsSubmitting(true);
         setMessage({ type: '', text: '' });

         const response = await sendResetOtp({ email: formData.email });

         setMessage({
            type: 'success',
            text: 'OTP sent successfully! Please check your email.'
         });

         // Start the timer
         startTimer();

         // Move to OTP step
         setStep('otp');
      } catch (error) {
         setMessage({
            type: 'error',
            text: error.message || 'Failed to send OTP. Please try again.'
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleResendOtp = async () => {
      try {
         setIsResending(true);
         setMessage({ type: '', text: '' });

         await sendResetOtp({ email: formData.email });

         setMessage({
            type: 'success',
            text: 'OTP resent successfully! Please check your email.'
         });

         // Reset the timer
         startTimer();
      } catch (error) {
         setMessage({
            type: 'error',
            text: error.message || 'Failed to resend OTP. Please try again.'
         });
      } finally {
         setIsResending(false);
      }
   };

   const handleResetPassword = async (e) => {
      e.preventDefault();
      if (!validateOtpForm()) return;

      try {
         setIsSubmitting(true);
         setMessage({ type: '', text: '' });

         await resetPassword({
            email: formData.email,
            otp: formData.otp,
            newPassword: formData.newPassword
         });

         setMessage({
            type: 'success',
            text: 'Password has been reset successfully!'
         });

         // Clear the timer
         if (timerRef.current) clearInterval(timerRef.current);

         // Move to success step
         setStep('success');
      } catch (error) {
         setMessage({
            type: 'error',
            text: error.message || 'Failed to reset password. Please try again.'
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const renderEmailStep = () => (
      <form onSubmit={handleSendOtp} className="mt-4">
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
            disabled={isSubmitting}
            className="w-full bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md
          hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)] transition cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed"
         >
            {isSubmitting ? 'Sending...' : 'Send Reset OTP'}
         </button>
      </form>
   );

   const renderOtpStep = () => (
      <form onSubmit={handleResetPassword} className="mt-4">
         <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
               <label className="text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
                  OTP Code
               </label>
               <span className="text-sm font-medium text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)]">
                  Time remaining: {formatTime(timeLeft)}
               </span>
            </div>
            <input
               type="text"
               name="otp"
               value={formData.otp}
               onChange={handleChange}
               placeholder="Enter 6-digit OTP"
               maxLength={6}
               className="w-full px-3 py-2 border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
            dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)]
            dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)]
            dark:focus:ring-[var(--color-accent-dark)]"
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
         </div>

         <div className="mb-4">
            <label className="block mb-1 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
               New Password
            </label>
            <input
               type="password"
               name="newPassword"
               value={formData.newPassword}
               onChange={handleChange}
               placeholder="Enter new password"
               className="w-full px-3 py-2 border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
            dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)]
            dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)]
            dark:focus:ring-[var(--color-accent-dark)]"
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
         </div>

         <div className="mb-4">
            <label className="block mb-1 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
               Confirm New Password
            </label>
            <input
               type="password"
               name="confirmPassword"
               value={formData.confirmPassword}
               onChange={handleChange}
               placeholder="Confirm new password"
               className="w-full px-3 py-2 border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]
            dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)]
            dark:border-[var(--color-border-dark)] focus:ring-2 focus:ring-[var(--color-accent-light)]
            dark:focus:ring-[var(--color-accent-dark)]"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
         </div>

         <div className="flex gap-2 mb-4">
            <button
               type="submit"
               disabled={isSubmitting || timeLeft === 0}
               className="flex-1 bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md
            hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)] transition cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
               type="button"
               onClick={handleResendOtp}
               disabled={isResending || timeLeft > 0}
               className="px-4 py-2 border border-[var(--color-accent-light)] dark:border-[var(--color-accent-dark)] 
            text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)] rounded-md hover:bg-gray-100 
            dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
         </div>

         <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] 
          hover:underline text-sm mt-2"
         >
            ← Back to Email
         </button>
      </form>
   );

   const renderSuccessStep = () => (
      <div className="mt-4 text-center">
         <svg
            className="w-16 h-16 mx-auto text-green-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M5 13l4 4L19 7"
            ></path>
         </svg>

         <h3 className="text-xl font-bold mb-2 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
            Password Reset Successful
         </h3>

         <p className="mb-4 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
            Your password has been reset successfully. You can now log in with your new password.
         </p>

         <Link
            to="/sign-in"
            className="block w-full bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md
          hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)] transition text-center"
         >
            Go to Sign in
         </Link>
      </div>
   );

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

            {message.text && (
               <div className={`mb-4 p-3 rounded-md text-sm ${message.type === 'error'
                     ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                     : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                  {message.text}
               </div>
            )}

            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOtpStep()}
            {step === 'success' && renderSuccessStep()}
         </div>
      </>
   );
};

export default ForgotPassword;