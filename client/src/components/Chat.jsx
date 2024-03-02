import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import axios from "axios";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  getFriendsFailure,
  getFriendsStart,
  getFriendsSuccess,
  getMessagesFailure,
  getMessagesStart,
  getMessagesSuccess,
  sendMessagesFailure,
  sendMessagesStart,
  sendMessagesSuccess,
} from "../store/reducers/chatReducer";
import ActiveFriends from "./ActiveFriends";
import Friends from "./Friends";
import RightSide from "./RightSide";

const Chat = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const { friends, messages } = useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.user);
  const [currentFriend, setCurrentFriend] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const handleInput = (e) => {
    setNewMessage(e.target.value);
  };
  const sendMessage = async (e) => {
    e.preventDefault();
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
        setNewMessage("")
      }
    } catch (error) {
      dispatch(sendMessagesFailure(error.response.data?.msg));
      console.log(error.response.data?.msg);
    }
  };
  const sendEmoji = (emo) => {
    setNewMessage(`${newMessage}` + emo);
  };
  const sendImage = async (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const promise = storeImage(file);
      promise
        .then(async (url) => {
          console.log("Image uploaded successfully");
          const messageData = {
            senderId: currentUser?._id,
            senderName: currentUser?.username,
            receiverId: currentFriend?._id,
            image: url || "",
          };
          try {
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
        }
      } catch (error) {
        dispatch(getFriendsFailure(error.response?.data?.msg));
        console.log(error.message);
      }
    };
    getfrinds();
  }, []);
  useEffect(() => {
    if (friends?.length > 0) {
      setCurrentFriend(friends[0]);
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
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="chat">
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
                <div className="icon">
                  <BsThreeDots />
                </div>
                <div className="icon">
                  <FaEdit />
                </div>
              </div>
            </div>
            <div className="friend_search">
              <div className="search">
                <button>
                  <BiSearch />
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className="form_control"
                />
              </div>
            </div>
            <div className="active_friends">
              <ActiveFriends />
            </div>
            <div className="friends">
              {friends?.length > 0
                ? friends.map((frd, i) => (
                    <div
                      onClick={() => setCurrentFriend(frd)}
                      className={`${
                        currentFriend._id === frd._id
                          ? "hover_friend  active"
                          : "hover_friend"
                      }`}
                      key={i}
                    >
                      <Friends friend={frd} />
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
          />
        ) : (
          "No conversation selected"
        )}
      </div>
    </div>
  );
};

export default Chat;
