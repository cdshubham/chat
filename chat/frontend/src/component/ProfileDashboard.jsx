import { useUserContext } from "../Context/UserContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function ProfileDashboard() {
  const { UserInfo, userLogin, updateUserFullname, updateUserProfilePic } =
    useUserContext();
  const [edit, setEdit] = useState(true);
  const [isPicLarge, setIsPicLarge] = useState(false);
  const [inputValue, setInputValue] = useState(UserInfo.fullname);
  const [imageFlag, setImageFlag] = useState(true);
  const navigate = useNavigate();
  const imageRef = useRef();

  const handleSaveFullName = () => {
    if (edit) {
      setEdit(false);
    } else {
      if (!inputValue) {
        return alert("Empty Values not allowed");
      }
      fetch(`http://localhost:8000/api/updates/updatename/${inputValue}`, {
        method: "POST",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((result) => {
          updateUserFullname(result.user?.fullname);
          setEdit(true);
        });
    }
  };

  const handlePicDoubleClick = () => {
    setIsPicLarge(!isPicLarge);
  };

  function extractDayMonthYear(isoString) {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
  }

  const handleImageButton = () => {
    if (imageFlag) {
      setImageFlag(false);
    } else {
      const imageFile = imageRef.current.files[0];
      if (!imageFile) {
        return alert("The Image file should not be Empty");
      }
      const formData = new FormData();
      formData.append("profilepic", imageFile);

      fetch("http://localhost:8000/api/updates/updateprofilepic", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.url) {
            updateUserProfilePic(result.url);
            alert("Profile picture updated successfully");
          } else {
            alert(result.error);
          }
        });
      setImageFlag(true);
    }
  };

  return userLogin ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full relative">
        <div className="flex flex-col items-center gap-2">
          <div
            className="text-[24px] rounded-xl text-center px-2 hover:bg-blue-200 absolute left-4 top-4 cursor-pointer"
            onClick={() => navigate("/room")}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>
          {imageFlag ? (
            <img
              className={`rounded-full mx-auto transition-all duration-300 bg-red-400 ${
                isPicLarge ? "w-64 h-64" : "w-32 h-32"
              }`}
              src={UserInfo.profilePic}
              alt="Profile Picture"
              onDoubleClick={handlePicDoubleClick}
            />
          ) : (
            <FileInput imageRef={imageRef} />
          )}
          <button
            className="mt-4 text-lg text-blue-500 hover:underline font-semibold"
            onClick={handleImageButton}
          >
            {imageFlag ? "Change Profile Pic" : "Save"}
          </button>
        </div>
        <div className="mt-6 text-center">
          <div className="relative inline-block">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={edit}
              className="text-xl font-semibold text-gray-900 outline-none text-center w-full px-4 py-2 bg-gray-100 rounded-lg"
            />
            <button
              className="absolute right-2 bottom-2 text-md text-blue-500 hover:underline font-semibold"
              onClick={handleSaveFullName}
            >
              {edit ? "Edit" : "Save"}
            </button>
          </div>
          <h3 className="text-gray-600 mt-4 text-xl">
            <b>User Since {extractDayMonthYear(UserInfo.createdAt)}</b>
          </h3>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Please Login Again</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Login Page
        </button>
      </div>
    </div>
  );
}

const FileInput = ({ imageRef }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = () => {
    imageRef.current.click();
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={imageRef}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <button onClick={handleClick} className="custom-file-button">
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="preview-image" />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <i className="fa-regular fa-image text-white text-3xl"></i>

            <p className="text-white text-xl">Choose a image</p>
          </div>
        )}
      </button>
    </div>
  );
};

export default ProfileDashboard;
