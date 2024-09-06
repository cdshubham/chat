import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [condition, setCondition] = useState(false);
  const [OTP, setOTP] = useState("");
  const [passcode, setPasscode] = useState("");
  const navigate = useNavigate();

  const SendOTP = () => {
    fetch(`http://localhost:8000/api/updates/verifyemail/${email}`, {
      method: "POST",
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        setCondition(true);
      } else {
        response.json().then((result) => alert(result.error));
      }
    });
  };

  const HandleOTP = () => {
    fetch(`http://localhost:8000/api/updates/${OTP}/${email}/${passcode}`, {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        setEmail("");
        setOTP("");
        setCondition(false);
        alert(
          "Your Password has been updated successfully. You can log in now."
        );
        navigate("/login");
      } else {
        response.json().then((result) => alert(result.error));
        window.location.reload();
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!condition ? (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
            Forgot Password
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Enter your registered email address to receive an OTP
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Email Address"
          />
          <button
            type="button"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none transition-colors duration-300"
            onClick={SendOTP}
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
            Verify OTP
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            An OTP has been sent to your email address
          </p>
          <input
            type="text"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            placeholder="Enter OTP"
          />
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            placeholder="New Password"
          />
          <button
            type="button"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none transition-colors duration-300"
            onClick={HandleOTP}
          >
            Verify
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
