import React, { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { changeStatus, ChangeUserInfo, updateUsers } = useUserContext();
  const navigate = useNavigate();

  const userForSideBar = () => {
    fetch("http://localhost:8000/api/users", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        updateUsers(result);
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { username, password };
    fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          const data = response.json();
          data.then((result) => {
            changeStatus(true);
            ChangeUserInfo(result);
            userForSideBar();
            navigate("/room");
          });
        } else {
          alert("Username or password is incorrect");
        }
      })
      .catch((error) => {
        alert("Something went wrong, Try again after sometime");
      });
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="grid grid-cols-2 bg-gradient-to-r from-sky-300 to-sky-100 select-none">
      <div className="h-screen w-[70%] flex justify-center items-center">
        <div className="max-w-[500px]">
          <div>
            <p className="text-4xl font-extrabold">Welcome Back!</p>
            <p className="font-thin">Enter your credentials to login</p>
          </div>
          <div className="mt-14">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="username">
                  Username <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="py-3 px-3 rounded-lg outline-none"
                  placeholder="Enter Your Username"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-3 px-3 rounded-lg outline-none w-full pr-12"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute z-10 right-4 top-3"
                  >
                    {showPassword ? (
                      <i className="fa-regular fa-eye-slash"></i>
                    ) : (
                      <i className="fa-regular fa-eye"></i>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-8">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                  Login
                </button>
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an Account?{" "}
                  <a href="/" className="text-blue-500 hover:text-blue-700">
                    Register
                  </a>
                </p>
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Forgot Password?{" "}
                  <a
                    href="/forgotpassword"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Forgot Password
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="h-screen w-full">
        <div className="flex items-center justify-center h-full">
          <img src="./login.gif" alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
