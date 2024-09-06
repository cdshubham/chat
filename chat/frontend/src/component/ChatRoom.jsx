import { useEffect, useState, useRef } from "react";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
import notificationsound from "../assets/sounds/notification.mp3";
import SendImages from "./SendImages";

const ChatRoom = () => {
  const { sideBarUsers } = useUserContext();
  const { userLogin, UserInfo, changeStatus } = useUserContext();
  const [newMessage, setNewMessage] = useState("");
  const [selectUser, setSelectUser] = useState(null);
  const [previousmessages, setpreviousmessages] = useState({});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const { onlineusers, socket } = useSocketContext();
  const messagesEndRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    // Remove animation class after animation ends to reset it
    setTimeout(() => {
      setAnimate(false);
    }, 500); // Match the duration of the animation
  };

  useEffect(() => {
    if (selectUser) {
      if (previousmessages?.[selectUser.fullname]) {
        setloading(true);
        return;
      }
      fetch(`http://localhost:8000/api/messages/${selectUser._id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          response.json().then((result) => {
            alert("Your Session has expired Please Login Again");
            return navigate("/login");
          });
        })
        .then((result) => {
          setpreviousmessages((previous) => {
            return { ...previous, [selectUser.fullname]: result };
          });
        });
    }
  }, [selectUser]);

  useEffect(() => {
    setloading(true);
  }, [previousmessages]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage) => {
        console.log(newMessage);
        newMessage.shouldshake = true;
        const sound = new Audio(notificationsound);
        sound.play();
        if (newMessage.senderId !== UserInfo._id) {
          const tempUser = sideBarUsers.find(
            (user) => user._id === newMessage.senderId
          );
          setpreviousmessages((previous) => {
            const userMessages = previous[tempUser?.fullname] || [];
            return {
              ...previous,
              [tempUser?.fullname]: [...userMessages, newMessage],
            };
          });
        }
        scrollToBottom();
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket, selectUser, userLogin._id]);

  const HandleSendMessages = (e) => {
    e.preventDefault();
    if (newMessage) {
      const messageData = {
        message: newMessage,
        senderId: UserInfo._id,
        updatedAt: new Date().toISOString(),
        receiverId: selectUser._id,
        _id: Date.now().toString(),
        type: "text",
      };
      setpreviousmessages((previous) => {
        const userMessages = previous[selectUser.fullname] || [];
        return {
          ...previous,
          [selectUser.fullname]: [...userMessages, messageData],
        };
      });
      fetch(`http://localhost:8000/api/messages/send/${selectUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
        credentials: "include",
      })
        .then((response) => response.json())
        .catch((err) =>
          alert(
            "There is an error while sending this message. Please send it again."
          )
        );
      setNewMessage("");
      scrollToBottom();
    } else {
      alert("Empty message cannot be sent");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [previousmessages, loading]);

  function HandlebackToLogin() {
    navigate("/login");
  }

  function HandleLogout() {
    fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        alert("You have successfully logged out");
        changeStatus(false);
        navigate("/login");
      }
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [selectUser]);

  function convertDataAndTime(isoString) {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = hours.toString().padStart(2, "0");
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  return userLogin ? (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-1/4 bg-gray-800 text-white border-r relative">
        <div className="flex flex-col items-center p-4 border-b bg-gray-700 w-full relative">
          <div className=" w-full">
            <div className="">
              <img
                src={UserInfo.profilePic}
                alt="Profile"
                className="rounded-full bg-gray-400 h-16 w-16 cursor-pointer"
                onClick={() => navigate("/profile")}
              />
            </div>
            <div className="absolute top-0 right-0 flex m-2">
              <button
                className="text-3xl font-semibold text-gray-400 hover:text-gray-200 mr-4"
                onClick={() => navigate("/status")}
              >
                <i className="fa-solid fa-circle-user"></i>
              </button>
              <img
                src="https://cdn1.iconfinder.com/data/icons/heroicons-ui/24/logout-512.png"
                alt="Logout"
                className="rounded-full bg-gray-400 h-8 cursor-pointer hover:bg-gray-200 mt-[2px]"
                onClick={HandleLogout}
              />
            </div>
          </div>
          <button
            className="bg-green-500 px-20 py-2 fixed bottom-0 hover:bg-green-600"
            onClick={() => navigate("/groups")}
          >
            Groups
          </button>
        </div>
        <div className="overflow-y-auto flex-grow p-2 bg-gray-900">
          {sideBarUsers?.map((user) => (
            <div
              className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition duration-300 ease-in-out transform hover:bg-gray-700 ${
                selectUser && selectUser._id === user._id ? "bg-gray-600" : ""
              }`}
              key={user._id}
              onClick={() => {
                setSelectUser((previous) => {
                  if (previous !== user) {
                    setloading(true);
                    return user;
                  } else {
                    return previous;
                  }
                });
              }}
            >
              <img
                src={user.profilePic}
                alt=""
                className="rounded-full h-12 w-12 object-cover"
              />
              <div className="ml-4 flex-grow text-left">
                <div className="text-lg font-semibold">{user.username}</div>
                <div
                  className={`text-sm ${
                    onlineusers.includes(user._id)
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {onlineusers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-3/4 bg-white">
        {selectUser ? (
          <>
            <div className="flex items-center p-4 bg-gray-100 border-b">
              <img
                src={selectUser.profilePic}
                alt=""
                className="rounded-full h-14 w-14"
              />
              <div className="ml-4">
                <div className="text-lg font-semibold">
                  {selectUser.fullname}
                </div>
                <div
                  className={`text-sm ${
                    onlineusers.includes(selectUser._id)
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {onlineusers.includes(selectUser._id) ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-grow p-4 overflow-y-auto bg-gray-50">
              <ul className="space-y-2">
                {loading ? (
                  previousmessages[selectUser.fullname]?.map((message) =>
                    message.senderId === UserInfo._id ? (
                      <div
                        key={message._id}
                        className="flex flex-row items-start mb-2 justify-end"
                      >
                        <img
                          src={UserInfo.profilePic}
                          alt=""
                          className="h-10 aspect-square rounded-full mr-2"
                        />
                        <div
                          className={`bg-gray-200 p-3 rounded-lg max-w-xs${
                            message.shouldshake ? " shake" : ""
                          }`}
                        >
                          {message.type === "text" ? (
                            <p className="mb-1">{message.message}</p>
                          ) : (
                            <img src={message.message} alt="" />
                          )}
                          <p className="text-xs text-gray-600">
                            {convertDataAndTime(message.updatedAt)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={message._id}
                        className="flex flex-row items-start mb-2 "
                      >
                        <img
                          src={selectUser.profilePic}
                          alt=""
                          className="h-10 aspect-square rounded-full"
                        />
                        <div
                          className={`bg-blue-500 text-white p-3 rounded-lg max-w-xs ml-2${
                            message.shouldshake ? " shake" : ""
                          }`}
                        >
                          {message.type === "text" ? (
                            <p className="mb-1">{message.message}</p>
                          ) : (
                            <img src={message.message} alt="" />
                          )}
                          <p className="text-xs text-white">
                            {convertDataAndTime(message.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p>Loading previous messages...</p>
                )}
                <div ref={messagesEndRef} />
              </ul>
            </div>

            <form
              onSubmit={HandleSendMessages}
              className="flex items-center p-6 bg-gray-100 overflow-hidden"
            >
              <SendImages
                selectUser={selectUser}
                senderId={UserInfo._id}
                setpreviousmessages={setpreviousmessages}
              />
              <input
                value={newMessage}
                className="flex-grow rounded-full py-2 px-8 border-gray-300 focus:outline-none"
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
              />
              <button
                type="submit"
                className={`ml-4 p-3 rounded-full text-blue-500 text-xl relative ${
                  animate ? "animate-fly-right" : ""
                }`}
                onClick={handleClick}
              >
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center flex-grow bg-gray-200">
            <img
              src="https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo="
              alt="Welcome"
              className="h-screen w-auto"
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Please Login Again</h1>
        <button
          onClick={HandlebackToLogin}
          className="bg-blue-500 text-white p-3 rounded-lg"
        >
          Login Page
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
