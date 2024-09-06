import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

function ShowStatus() {
  const [number, setnumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const { userLogin } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { singleStatus } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {userLogin ? (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between mb-4">
            <button
              className="bg-black text-white p-4 rounded-lg text-xl"
              onClick={() => navigate("/status")}
            >
              Back
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                if (number > 0) {
                  setnumber((prev) => prev - 1);
                }
              }}
              className="bg-blue-500 text-white px-2 py-3 rounded hover:bg-blue-600 text-3xl"
            >
              {"<"}
            </button>
            <div className="w-96 h-96 bg-gray-700 flex items-center justify-center rounded-lg p-2">
              {loading ? (
                <div className="loader"></div>
              ) : (
                <img
                  src={singleStatus?.statusData[number]}
                  alt="Not available"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <button
              onClick={() => {
                if (number < singleStatus?.statusData?.length - 1) {
                  setnumber((prev) => prev + 1);
                }
              }}
              className="bg-blue-500 text-white px-2 py-3 rounded hover:bg-blue-600 text-3xl"
            >
              {">"}
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-black text-white text-2xl p-3 rounded"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default ShowStatus;
