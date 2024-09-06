import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [otpscreen, setotpscreen] = useState(false);
  const [tempdata, settempdata] = useState({});
  const [loading, setloading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [otp, setotp] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setloading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        settempdata(data);
        setotpscreen(true);
      } else {
        const result = await response.json();
        alert(result.error);
        setloading(false);
      }
    } catch (error) {
      setBackendError("An error occurred while verifying.");
      setloading(false);
    }
  };

  const SignupVerification = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...tempdata, OTP: otp }),
        credentials: "include",
      });

      if (response.ok) {
        alert("You can Login Now");
        settempdata("");
        setotpscreen(false);
        setloading(false);
        navigate("/login");
      } else {
        alert("Wrong OTP Entered");
        setloading(false);
      }
    } catch (error) {
      setBackendError("An error occurred while signing up.");
      setloading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 bg-gradient-to-r from-red-300 to-red-100 select-none overflow-hidden">
      {!otpscreen ? (
        <div className="h-full w-[70%] flex justify-center items-center mt-5">
          <div className="max-w-[500px]">
            <div>
              <p className="text-4xl font-extrabold">Create an Account</p>
            </div>
            <div className="mt-7">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="fullname">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="py-2 px-3 rounded-lg outline-none"
                    placeholder="Full Name"
                    {...register("fullname", {
                      required: "Full Name is required",
                    })}
                  />
                  {errors.fullname && (
                    <span className="text-red-600">
                      {errors.fullname.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="username">
                    Username <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className="py-2 px-3 rounded-lg outline-none"
                    placeholder="Username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                  />
                  {errors.username && (
                    <span className="text-red-600">
                      {errors.username.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="email">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    className="py-2 px-3 rounded-lg outline-none"
                    placeholder="Email Address"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <span className="text-red-600">{errors.email.message}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="password">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="w-full relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="py-2 px-3 rounded-lg outline-none w-full pr-12"
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute z-10 right-4 top-2"
                    >
                      {showPassword ? (
                        <i className="fa-regular fa-eye-slash"></i>
                      ) : (
                        <i className="fa-regular fa-eye"></i>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-red-600">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    className="py-2 px-3 rounded-lg outline-none"
                    placeholder="Confirm password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                    })}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-600">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label htmlFor="gender">
                    Gender <span className="text-red-600">*</span>
                  </label>
                  <select
                    className="py-2 px-3 rounded-lg outline-none"
                    {...register("gender", { required: "Gender is required" })}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-600">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
                {backendError && (
                  <div className="text-red-600 mt-4">{backendError}</div>
                )}
                <div className="mt-8 w-full bg-red-500 py-2 rounded-md text-white flex justify-center text-xl cursor-pointer">
                  <button type="submit">
                    {loading ? "Processing..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
            <div className="text-sm flex justify-center items-center fixed bottom-2 right-4">
              <p onClick={() => navigate("/login")} className=" cursor-pointer">
                <LoginCLick />
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-[70%] flex justify-center items-center ml-8 ">
          <div className="max-w-[500px] bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              OTP has been sent to the provided Email
            </h2>
            <input
              type="text"
              onChange={(e) => setotp(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={SignupVerification}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none"
            >
              Verify
            </button>
          </div>
        </div>
      )}
      <div className="h-screen w-full">
        <div className="flex items-center justify-center h-full">
          <img src="./register.gif" alt="hello" />
        </div>
      </div>
    </div>
  );
};

function LoginCLick() {
  return (
    <div className="wrapper m-2">
      <a className="cta">
        <span className="mt-2">Login</span>
        <span>
          <svg width="20px" height="20px" viewBox="0 0 66 43" version="1.1">
            <g
              id="arrow"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <path
                className="one"
                d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
              <path
                className="two"
                d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
              <path
                className="three"
                d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z"
                fill="#FFFFFF"
              ></path>
            </g>
          </svg>
        </span>
      </a>
    </div>
  );
}

export default SignupForm;
