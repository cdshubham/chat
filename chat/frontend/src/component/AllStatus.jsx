import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStatus } from "../Context/StatusContext";
import { useUserContext } from "../Context/UserContext";

function AllStatus() {
  const navigate = useNavigate();
  const { userLogin } = useUserContext();
  const { updateallStatusData, allStatusData } = useStatus();

  const GetAllStatus = () => {
    fetch("http://localhost:8000/api/status/getallstatus", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((result) => updateallStatusData(result.alluserStatus))
      .catch((error) => alert("Unexpected Error Occurred"));
  };

  useEffect(GetAllStatus, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {userLogin ? (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-x-auto">
          <div className="flex justify-between mb-4 fixed top-10">
            <button
              onClick={() => navigate("/mystatus")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              My Status
            </button>
            <button
              onClick={() => navigate("/room")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 right-0 ml-[42rem]"
            >
              Back
            </button>
          </div>
          <div className="flex gap-4">
            {allStatusData?.map((singleStatus) => (
              <div
                key={singleStatus._id}
                className="w-80 flex-none bg-gray-100 p-4 m-4 rounded-lg cursor-pointer hover:bg-gray-200"
                onClick={() =>
                  navigate("/showstatus", { state: { singleStatus } })
                }
              >
                <div
                  className="w-40 h-40 rounded-full bg-cover bg-center mx-auto"
                  style={{
                    backgroundImage: `url(${singleStatus.statusId?.profilePic})`,
                  }}
                ></div>
                <p className="text-center text-gray-800 mt-4">
                  {singleStatus.statusId.fullname}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          className="bg-green-500 text-white text-2xl px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </div>
  );
}

export default AllStatus;
