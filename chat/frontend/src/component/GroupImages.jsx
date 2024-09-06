import React, { useEffect, useRef, useState } from "react";
import { usegroupContext } from "../Context/GroupContext";

function GroupImages({ groupId }) {
  const ImageRef = useRef();
  const { appendGroupMessages } = usegroupContext();
  const [loading, setLoading] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validateOfImages = file.type.split("/")[0] === "image";
      if (!validateOfImages) {
        alert("Only Image Files are Allowed");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const SendImageToGroup = () => {
    const file = ImageRef.current.files[0];
    if (!file) {
      return alert("Empty File cannot be sent");
    }
    const validateOfImages = file.type.split("/")[0] === "image";
    if (!validateOfImages) {
      return alert("Only Image Files are Allowed");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("imageFile", file);

    fetch(`http://localhost:8000/api/groups/sendimages/${groupId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          appendGroupMessages(result.receiverId, result);
        });
      } else {
        console.log(response);
      }
      setInputKey(Date.now());
      setLoading(false);
      setShowModal(false); // Close modal after sending image
    });
  };

  return (
    <div className="flex flex-row rounded gap-8">
      <label htmlFor="inputfield">
        <i className="fa-regular fa-image text-blue-500 text-xl cursor-pointer px-4 py-2"></i>
      </label>
      <input
        key={inputKey}
        type="file"
        className="p-2 rounded hidden"
        id="inputfield"
        ref={ImageRef}
        onChange={handleFileChange}
      />
      {/* {loading ? (
        <button className="bg-blue-400 rounded-xl p-2" disabled>
          Sending ..
        </button>
      ) : (
        <button
          onClick={SendImageToGroup}
          className="bg-blue-400 hover:bg-gray-600 rounded-xl p-2"
        >
          Send
        </button>
      )} */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-64 h-64 object-cover mb-4"
            />
            <button
              className="bg-blue-500 text-white p-2 rounded mr-2"
              onClick={SendImageToGroup}
            >
              Send
            </button>
            <button
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupImages;
