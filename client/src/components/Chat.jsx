import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socketIO from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { app } from "../firebase";
import useSound from "use-sound";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  deliverMessageUpdate,
  getFriendsFailure,
  getFriendsStart,
  getFriendsSuccess,
  getMessagesFailure,
  getMessagesStart,
  getMessagesSuccess,
  getSuccessClear,
  logoutSuccess,
  newUserAddClear,
  newUserAddSet,
  seenAll,
  seenMessageUpdate,
  sendMessagesFailure,
  sendMessagesStart,
  sendMessagesSuccess,
  sentSuccessClear,
  setTheme,
  updateFriend,
  updateFriendMessage,
  updateFriendMessageStatus,
} from "../store/reducers/chatReducer";
import ActiveFriends from "./ActiveFriends";
import Friends from "./Friends";
import RightSide from "./RightSide";
import notificationSound from "../audio/Slide.mp3";
import sendingSound from "../audio/Milestone.mp3";
import { RiLogoutBoxLine } from "react-icons/ri";
import { signOutSuccess } from "../store/reducers/userReducer";

const ENDPOINT = "http://localhost:4001/";
const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

const Chat = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const { friends, messages, sentSuccess, getSuccess, theme, newUserAdd } =
    useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.user);
  const [currentFriend, setCurrentFriend] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [hide, setHide] = useState(true);
  const [notifySound] = useSound(notificationSound);
  const [sendSound] = useSound(sendingSound);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const toggleRef = useRef();
  useEffect(() => {
    socket.emit("addUser", currentUser._id, currentUser);
  }, []);
  useEffect(() => {
    socket.on("getUsers", (users) => {
      const filterUsers = users.filter((u) => u.userId !== currentUser._id);
      setActiveUsers(filterUsers);
    });
    socket.on("newUserAdd", (data) => {
      dispatch(newUserAddSet(data));
    });
  }, []);
  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage(data);
    });
    socket.on("getTypingMessage", (data) => {
      setTyping(data);
    });
    socket.on("getMessageSeen", (msg) => {
      dispatch(seenMessageUpdate(msg));
    });
    socket.on("getMessageDeliver", (msg) => {
      dispatch(deliverMessageUpdate(msg));
    });
    socket.on("seenSuccess", (data) => {
      dispatch(seenAll(data));
    });
  }, []);
  useEffect(() => {
    if (sentSuccess) {
      socket.emit("sendMessage", messages[messages.length - 1]);
      dispatch(updateFriendMessage(messages[messages.length - 1]));
      dispatch(sentSuccessClear());
    }
  }, [sentSuccess]);
  useEffect(() => {
    const updateSeenMessage = async (arrivalMessage) => {
      try {
        const { data } = await axios.patch(
          `${base_url}/chat/seen-message`,
          arrivalMessage
        );
      } catch (error) {
        console.log(error.response.data?.msg);
      }
    };
    if (arrivalMessage && currentFriend) {
      if (
        arrivalMessage?.senderId === currentFriend?._id &&
        arrivalMessage?.receiverId === currentUser?._id
      ) {
        dispatch(sendMessagesSuccess(arrivalMessage));
        updateSeenMessage(arrivalMessage);
        socket.emit("messageSeen", arrivalMessage);
        dispatch(updateFriendMessageStatus({ msg: arrivalMessage }));
        dispatch(seenMessageUpdate(arrivalMessage));
      }
    }
    setArrivalMessage("");
  }, [arrivalMessage]);

  useEffect(() => {
    const updateDeliverMessage = async (arrivalMessage) => {
      try {
        const { data } = await axios.patch(
          `${base_url}/chat/deliver-message`,
          arrivalMessage
        );
      } catch (error) {
        console.log(error.response.data?.msg);
      }
    };
    if (
      arrivalMessage?.senderId !== currentFriend?._id &&
      arrivalMessage?.receiverId === currentUser?._id
    ) {
      sendSound();
      updateDeliverMessage(arrivalMessage);
      socket.emit("messageDeliver", arrivalMessage);
      toast.success(`${arrivalMessage.senderName} has sent a message`);
      dispatch(updateFriendMessageStatus({ msg: arrivalMessage }));
      dispatch(deliverMessageUpdate(arrivalMessage));
    }
    setArrivalMessage("");
  }, [arrivalMessage]);

  const handleInput = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typingMessage", {
      senderId: currentUser._id,
      receiverId: currentFriend._id,
      msg: e.target.value,
    });
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    notifySound();
    const messageData = {
      senderId: currentUser._id,
      senderName: currentUser.username,
      receiverId: currentFriend._id,
      text: newMessage ? newMessage : "❤️",
    };

    try {
      sendMessagesStart();
      const { data } = await axios.post(
        `${base_url}/chat/send-message`,
        messageData
      );
      if (data.msg) {
        dispatch(sendMessagesFailure(data?.msg));
      } else {
        dispatch(sendMessagesSuccess(data));
        // socket.emit("sendMessage", data);
        setNewMessage("");
        socket.emit("typingMessage", {
          senderId: currentUser._id,
          receiverId: currentFriend._id,
          msg: "",
        });
      }
    } catch (error) {
      dispatch(sendMessagesFailure(error.response.data?.msg));
      console.log(error.response.data?.msg);
    }
  };
  const sendEmoji = (emo) => {
    setNewMessage(`${newMessage}` + emo);
    socket.emit("typingMessage", {
      senderId: currentUser._id,
      receiverId: currentFriend._id,
      msg: emo,
    });
  };
  const sendImage = async (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const promise = storeImage(file);
      promise
        .then(async (url) => {
          console.log("Image uploaded successfully");
          socket.emit("sendMessage", {
            senderId: currentUser._id,
            senderName: currentUser.username,
            receiverId: currentFriend._id,
            time: new Date(),
            message: {
              text: "",
              image: url,
            },
          });
          const messageData = {
            senderId: currentUser?._id,
            senderName: currentUser?.username,
            receiverId: currentFriend?._id,
            image: url || "",
          };

          try {
            notifySound();
            sendMessagesStart();
            const { data } = await axios.post(
              `${base_url}/chat/send-image-message`,
              messageData
            );
            if (data.msg) {
              dispatch(sendMessagesFailure(data?.msg));
            } else {
              dispatch(sendMessagesSuccess(data));
            }
          } catch (error) {
            dispatch(sendMessagesFailure(error.response.data?.msg));
            console.log(error.response.data?.msg);
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };
  useEffect(() => {
    const getfrinds = async () => {
      try {
        dispatch(getFriendsStart());
        const { data } = await axios.get(
          `${base_url}/chat/get-friends/${currentUser._id}`
        );
        if (data.msg) {
          dispatch(getFriendsFailure(data?.msg));
        } else {
          dispatch(getFriendsSuccess(data));
          dispatch(newUserAddClear());
        }
      } catch (error) {
        dispatch(getFriendsFailure(error.response?.data?.msg));
        console.log(error);
      }
    };
    getfrinds();
  }, [newUserAdd,arrivalMessage,messages]);
  useEffect(() => {
    if (friends?.length > 0) {
      setCurrentFriend(friends[0].frndInfo);
    }
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        dispatch(getMessagesStart());
        const { data } = await axios.post(
          `${base_url}/chat/get-messages/${currentFriend._id}`,
          { userId: currentUser?._id }
        );
        if (data.msg) {
          dispatch(getMessagesFailure(data?.msg));
        } else {
          dispatch(getMessagesSuccess(data));
        }
      } catch (error) {
        console.log(error.message);
        dispatch(getMessagesFailure(error.response?.data?.msg));
      }
    };
    getMessages();
  }, [currentFriend?._id]);

  useEffect(() => {
    if (messages?.length > 0) {
      if (
        messages[messages.length - 1].senderId !== currentUser._id &&
        messages[messages.length - 1].status !== "seen"
      ) {
        try {
          dispatch(updateFriend(currentFriend._id));
          socket.emit("seen", {
            senderId: currentFriend._id,
            receiverId: currentUser._id,
          });
        } catch (error) {
          console.log(error.message);
        }

        const seenMessage = async () => {
          try {
            const { data } = await axios.patch(
              `${base_url}/chat/seen-message`,
              {
                _id: messages[messages.length - 1]._id,
              }
            );
          } catch (error) {
            console.log(error.response.data?.msg);
          }
        };
        seenMessage();
      }
    }
    dispatch(getSuccessClear());
  }, [getSuccess]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const handleHide = (e) => {
      if (toggleRef.current && !toggleRef.current.contains(e.target)) {
        setHide(true);
      }
    };
    window.addEventListener("click", handleHide);
    return () => {
      window.removeEventListener("click", handleHide);
    };
  }, []);
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${base_url}/auth/logout`, {
        withCredentials: true,
      });
      dispatch(signOutSuccess());
      socket.emit("logout", currentUser._id);
      dispatch(logoutSuccess());
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };
  const searcFriend = (e) => {
    const getFriends = document.getElementsByClassName("hover_friend");
    const friendNameClass = document.getElementsByClassName("fd_name");
    for (var i = 0; i < getFriends.length, i < friendNameClass.length; i++) {
      let text = friendNameClass[i].innerText.toLowerCase();
      if (text.indexOf(e.target.value.toLowerCase()) > -1) {
        getFriends[i].style.display = "";
      } else {
        getFriends[i].style.display = "none";
      }
    }
  };
  return (
    <div className={`chat ${theme === "dark" ? "theme" : ""}`}>
      <Toaster
        position={"top-right"}
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "18px",
          },
        }}
      />
      <div className="row">
        <div className="col-3">
          <div className="left_side">
            <div className="top">
              <div className="image_name">
                <div className="image_contain">
                  <img src={currentUser?.image} alt="" />
                </div>
                <div className="name">
                  <h3>{currentUser.username}</h3>
                </div>
              </div>
              <div className="icons">
                <div
                  onClick={(e) => e.stopPropagation() || setHide(false)}
                  className="icon"
                >
                  <BsThreeDots />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
                <div
                  ref={toggleRef}
                  className={hide ? "theme_logout" : "theme_logout show"}
                >
                  <h3>Dark Mode</h3>
                  <div className="on">
                    <input
                      onChange={(e) =>
                        dispatch(
                          setTheme(e.target.value) ||
                            localStorage.setItem("theme", e.target.value)
                        )
                      }
                      value="dark"
                      type="radio"
                      name="theme"
                      id="dark"
                    />
                    <label htmlFor="dark">On</label>
                  </div>
                  <div className="off">
                    <input
                      onChange={(e) =>
                        dispatch(
                          setTheme(e.target.value) ||
                            localStorage.setItem("theme", e.target.value)
                        )
                      }
                      value="light"
                      type="radio"
                      name="theme"
                      id="light"
                    />
                    <label htmlFor="light">Off</label>
                  </div>
                  <div onClick={handleLogout} className="logout">
                    <RiLogoutBoxLine /> Logout
                  </div>
                </div>
              </div>
            </div>
            <div className="friend_search">
              <div className="search">
                <button>
                  <BiSearch />
                </button>
                <input
                  onChange={searcFriend}
                  type="text"
                  placeholder="Search"
                  className="form_control"
                />
              </div>
            </div>
            <div className="active_friends">
              {activeUsers?.map((active, i) => (
                <ActiveFriends
                  setCurrentFriend={setCurrentFriend}
                  activeUsers={active}
                  key={i}
                />
              ))}
            </div>
            <div className="friends">
              {friends?.length > 0
                ? friends.map((frd, i) => (
                    <div
                      onClick={() => setCurrentFriend(frd.frndInfo)}
                      className={`${
                        currentFriend?._id === frd.frndInfo?._id
                          ? "hover_friend  active"
                          : "hover_friend"
                      }`}
                      key={i}
                    >
                      <Friends
                        activeUsers={activeUsers}
                        friend={frd}
                        userId={currentUser?._id}
                      />
                    </div>
                  ))
                : "No friends"}
            </div>
          </div>
        </div>
        {currentFriend ? (
          <RightSide
            currentFriend={currentFriend}
            handleInput={handleInput}
            setNewMessage={setNewMessage}
            newMessage={newMessage}
            sendMessage={sendMessage}
            messages={messages}
            scrollRef={scrollRef}
            sendEmoji={sendEmoji}
            sendImage={sendImage}
            activeUsers={activeUsers}
            typing={typing}
          />
        ) : (
          "No conversation selected"
        )}
      </div>
    </div>
  );
};

export default Chat;
