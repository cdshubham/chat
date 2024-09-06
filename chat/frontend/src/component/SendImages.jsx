import React, { useState, useRef } from "react";

const SendImages = ({ selectUser, setpreviousmessages }) => {
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileReference = useRef();

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

  const handleSendingImages = () => {
    if (!selectedImage) return;

    setLoading(true);
    const file = fileReference.current.files[0];
    const formData = new FormData();
    formData.append("image", file);

    fetch(`http://localhost:8000/api/messages/imagefile/${selectUser?._id}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          setpreviousmessages((previous) => {
            const userMessages = previous[selectUser.fullname] || [];
            return {
              ...previous,
              [selectUser.fullname]: [...userMessages, result],
            };
          });
        });
      } else {
        response.json().then((result) => alert(result.error));
      }
      setLoading(false);
      setShowModal(false);
      setInputKey(Date.now());
    });
  };

  return (
    <div className="flex flex-row rounded gap-8 cursor-pointer hover:bg-slate-200">
      <label htmlFor="inputfield">
        <i className="fa-regular fa-image text-blue-500 text-xl cursor-pointer px-4 py-2"></i>
      </label>
      <input
        key={inputKey}
        type="file"
        className="p-2 rounded hidden"
        ref={fileReference}
        id="inputfield"
        onChange={handleFileChange}
      />
      {/* {!loading ? (
          <button
            className="bg-blue-400 hover:bg-gray-600 rounded-xl p-2"
            onClick={() => fileReference.current.click()}
          >
            Select
          </button>
        ) : (
          <span>Sending...</span>
        )} */}

      {/* Modal for image preview and send button */}
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
              onClick={handleSendingImages}
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
};

export default SendImages;
