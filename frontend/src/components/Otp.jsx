import React, { useEffect, useState } from "react";
import { useVerifyEmail } from "../lib/react-query/queriesAndMutation";
import { useNavigate } from "react-router-dom";

const Otp = ({ setIsOtpOpen, setLoading, userID, email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const { mutate: verifyEmail, isLoading, isError, error, isSuccess } = useVerifyEmail();
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  useEffect(() => {
    document.getElementById("otp-0").focus();
    // if email userId is not present, close the popup
    if (!userID || !email) {
      setIsOtpOpen(false);
    }
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      setLoading(false);
      return;
    }
    verifyEmail({ userID, otp: enteredOtp });
  };

  // If verification succeeds, close the popup and navigate away
  if (isSuccess) {
    setLoading(false);
    setIsOtpOpen(false);
    navigate("/");
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-lg shadow-lg bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)]">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)]">
        Enter OTP
      </h2>
      <p className="text-sm mb-4 text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
        OTP sent to {email}
      </p>
      <div className="flex gap-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-10 h-12 text-center text-xl border rounded-md bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-[var(--color-text-primary-light)] dark:text-[var(--color-text-primary-dark)] border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-light)] dark:focus:ring-[var(--color-accent-dark)]"
          />
        ))}
      </div>
      {isError && (
        <p className="text-red-500 text-sm mb-2">
          {error?.message || "An error occurred. Try again."}
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full bg-[var(--color-accent-light)] dark:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded-md transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-accent-dark)] dark:hover:bg-[var(--color-accent-light)]"
          }`}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>
      {isSuccess && (
        <p className="text-green-500 text-sm mt-2">Email verified successfully!</p>
      )}
      <button
        onClick={() => setIsOtpOpen(false)}
        className="mt-3 text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:underline"
      >
        Cancel
      </button>
    </div>
  );
};

export default Otp;
