import React, { useEffect, useRef, useState } from "react";
import { usegroupContext } from "../Context/GroupContext";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
import GroupImages from "./GroupImages";

function Groups() {
  const {
    userGroupInfo,
    updateUserGroupInfo,
    userGroupMessages,
    updateuserGroupMessages,
    appendGroupMessages,
  } = usegroupContext();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { UserInfo, userLogin } = useUserContext();
  const navigate = useNavigate();
  const { newIncomingMessage } = useSocketContext();
  const newMessageRef = useRef(null);
  const [showparticipantsFlag, setshowparticipantsFlag] = useState(false);
  const [messageSentFlag, setmessageSentFlag] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (
      !isEmpty(newIncomingMessage) &&
      !userGroupMessages[newIncomingMessage.receiverId]?.includes(
        newIncomingMessage
      )
    ) {
      appendGroupMessages(newIncomingMessage.receiverId, newIncomingMessage);
      setmessageSentFlag((prev) => !prev);
    }
  }, [newIncomingMessage]);

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

  const scrollToBottom = () => {
    newMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isEmpty(userGroupMessages)) {
      fetch("http://localhost:8000/api/groups/getgroupuser", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Data Received");
          updateUserGroupInfo(() => result.usergroup);
          getMessagesFromFetchedData(result.usergroup);
        });
    }
  }, []);

  function getMessagesFromFetchedData(answer) {
    const tempDataHolder = {};
    answer?.Groups?.map((singleuser) => {
      tempDataHolder[singleuser._id] = singleuser.groupmessages;
    });
    updateuserGroupMessages(tempDataHolder);
  }

  const userSelected = (user) => {
    setSelectedGroup(user);
  };

  function convertDataAndTime(isoString) {
    const date = new Date(isoString);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");

    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  const messagesInGroup = (e) => {
    e.preventDefault();
    const createNewMessage = {
      _id: Date.now(),
      senderId: UserInfo._id,
      receiverId: selectedGroup._id,
      message: newMessage,
      type: "text",
      sendername: UserInfo.profilePic,
      createdAt: Date.now(),
    };
    appendGroupMessages(selectedGroup._id, createNewMessage);
    setmessageSentFlag((prev) => !prev);
    const groupId = selectedGroup?._id;
    const Participants = [];
    selectedGroup.participants?.map((singlepart) => {
      Participants.push(singlepart._id);
    });
    fetch("http://localhost:8000/api/groups/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        message: newMessage,
        sendername: UserInfo.profilePic,
        Participants,
      }),
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        // appendGroupMessages(selectedGroup._id, createNewMessage)
        console.log("Message Sent");
      } else {
        alert("Server Crashed Try again After Some Time");
      }
    });
    setNewMessage("");
  };

  const HandleParticipants = () => {
    setshowparticipantsFlag(true);
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedGroup, appendGroupMessages]);

  return userLogin ? (
    <div>
      <div className="flex flex-row text-gray-100 h-screen">
        <div className="bg-gray-900 flex flex-col w-1/4 p-4 overflow-y-auto">
          <div className="flex justify-between border-b border-white">
            <button
              className="p-2 rounded hover:bg-gray-400"
              onClick={() => navigate("/room")}
            >
              Back
            </button>
            <div className="flex flex-row justify-between">
              <button
                className="rounded-full p-2 hover:bg-gray-400"
                onClick={() => navigate("/newgroup")}
              >
                <i className="fa-solid fa-user-group"></i>
              </button>
            </div>
          </div>
          <div className=" text-xl text-center p-2 mb-2"></div>
          {userGroupInfo?.Groups?.map((singleUser) => (
            <div
              className="flex items-center gap-3 p-2 cursor-pointer border border-white hover:bg-gray-400"
              key={singleUser._id}
              onClick={() => userSelected(singleUser)}
            >
              <img
                src={singleUser.grouppic}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <p className="text-lg">{singleUser.groupname}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col flex-grow text-black">
          {selectedGroup ? (
            <>
              <div className="bg-gray-100 p-2 text-lg font-semibold border-b flex flex-row justify-end flex-basis relative">
                <div className=" absolute top-1/4 left-5">
                  {selectedGroup.groupname}
                </div>
                {!showparticipantsFlag ? (
                  <button
                    className="hover:bg-gray-400 rounded-full mr-4"
                    onClick={HandleParticipants}
                  >
                    <i className="fa-solid fa-people-group p-2"></i>
                  </button>
                ) : (
                  <div className="bg-gray-200 p-4 rounded-lg shadow-md absolute right-20 -top-1">
                    <button
                      onClick={() => setshowparticipantsFlag(false)}
                      className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold focus:outline-none focus:shadow-outline text-sm"
                    >
                      <i className="fa-solid fa-xmark p-2 "></i>
                    </button>
                    <ul className="mt-3">
                      {selectedGroup?.participants?.map((singleuser) => (
                        <li key={singleuser._id} className="text-gray-800">
                          {singleuser.fullname}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  className="hover:bg-gray-400 rounded-full mr-4"
                  onClick={() =>
                    navigate("/addusers", {
                      state: {
                        groupId: selectedGroup._id,
                        participants: selectedGroup.participants,
                      },
                    })
                  }
                >
                  <i className="fa-solid fa-circle-plus p-2"></i>
                </button>
                {/* <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHcVlE9tWBZbgl6lV9i931WKCccCXwuy-CFw&s"
                  alt="Down"
                  className="h-8 w-8 rounded-lg bg-red-200"
                  onClick={() => scrollToBottom()}
                /> */}
              </div>
              <div className="flex-grow p-4 px-1 overflow-y-auto flex flex-col">
                {userGroupMessages[selectedGroup._id]?.map(
                  (singleMessage, index) => (
                    <div
                      key={index}
                      className={`p-2 mb-2  max-w-fit flex  ${
                        singleMessage.shouldshake ? "shake" : ""
                      } ${
                        singleMessage.senderId == UserInfo._id
                          ? " self-end"
                          : ""
                      }`}
                    >
                      <img
                        src={singleMessage.sendername}
                        className={`h-10 aspect-square rounded-full mr-1 ${
                          singleMessage.senderId == UserInfo._id
                            ? "bg-green-300"
                            : "bg-gray-200"
                        }`}
                      />
                      <div
                        className={` flex flex-col mt-1 p-2 rounded-xl ${
                          singleMessage.senderId == UserInfo._id
                            ? "bg-green-300"
                            : "bg-gray-200"
                        }`}
                      >
                        {singleMessage.type === "text" ? (
                          singleMessage.message
                        ) : (
                          <div className="bg-gray-300">
                            <img
                              src={singleMessage.message}
                              alt=""
                              className="max-w-[400px]"
                            />
                          </div>
                        )}
                        <p className="text-xs text-gray-600">
                          {convertDataAndTime(singleMessage.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                )}
                <div ref={newMessageRef} />
              </div>
              <form
                onSubmit={messagesInGroup}
                className="flex items-center p-4 border-t bg-gray-100"
              >
                <GroupImages
                  groupId={selectedGroup._id}
                  fullname={UserInfo?.fullname}
                />
                <input
                  value={newMessage}
                  className="flex-grow rounded-full py-2 px-6 border-gray-300 focus:outline-none"
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message"
                />
                <button
                  type="submit"
                  className={`ml-4 p-3 rounded-full text-blue-500 text-xl relative ${
                    animate ? "animate-fly-right" : ""
                  }`}
                >
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500">Select a group to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-green-300 text-center">
      <button onClick={() => navigate("/login")}>Login Again</button>
    </div>
  );
}

export default Groups;
