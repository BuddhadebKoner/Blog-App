import React, { useEffect, useState } from "react";
import { useVerifyEmail } from "../lib/react-query/queriesAndMutation";
import { useNavigate } from "react-router-dom";

const Otp = ({ setIsOtpOpen, userID, email }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const { mutate: verifyEmail, isLoading, isError, error, isSuccess } = useVerifyEmail();

  // navigate 
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
  }, []);

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    verifyEmail({ userID, otp: enteredOtp });
  };

  // if sucess close the otp 
  if (isSuccess) {
    setIsOtpOpen(false);
    navigate("/");
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Enter OTP</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">OTP sent to {email}</p>

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
            className="w-10 h-12 text-center text-xl border border-gray-400 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        ))}
      </div>

      {isError && <p className="text-red-500 text-sm">{error?.message || "An error occurred. Try again."}</p>}

      <button
        onClick={handleSubmit}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
          }`}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </button>

      {isSuccess && <p className="text-green-500 text-sm mt-2">Email verified successfully!</p>}

      <button onClick={() => setIsOtpOpen(false)} className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:underline">
        Cancel
      </button>
    </div>
  );
};

export default Otp;
