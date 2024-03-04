import React from "react";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import Message from "./Message";
import MessageSend from "./MessageSend";
import FriendInfo from "./FriendInfo";

const RightSide = ({
  currentFriend,
  handleInput,
  setNewMessage,
  newMessage,
  sendMessage,
  messages,
  scrollRef,
  sendEmoji,
  sendImage,
  activeUsers,
  typing
}) => {
  return (
    <div className="col-9">
      <div className="right_side">
        <input type="checkbox" name="" id="dot" />
        <div className="row">
          <div className="col-8">
            <div className="message_send_show">
              <div className="header">
                <div className="image_name">
                  <div className="image">
                    <img src={currentFriend.image} alt="" />
                    {activeUsers?.length > 0 &&
                      activeUsers.some(
                        (u) => u.userId === currentFriend._id
                      ) && <div className="active_icon"></div>}
                  </div>
                  <div className="name">
                    <h3>{currentFriend.username}</h3>
                  </div>
                </div>
                <div className="icons">
                  <div className="icon">
                    <IoCall size={20} />
                  </div>
                  <div className="icon">
                    <BsCameraVideoFill size={20} />
                  </div>
                  <div className="icon">
                    <label htmlFor="dot">
                      <HiDotsCircleHorizontal size={20} />
                    </label>
                  </div>
                </div>
              </div>
              <Message
                messages={messages}
                currentFriend={currentFriend}
                scrollRef={scrollRef}
                typing={typing}
              />
              <MessageSend
                handleInput={handleInput}
                setNewMessage={setNewMessage}
                newMessage={newMessage}
                sendMessage={sendMessage}
                sendEmoji={sendEmoji}
                sendImage={sendImage}
              />
            </div>
          </div>
          <div className="col-4">
            <FriendInfo
              currentFriend={currentFriend}
              activeUsers={activeUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
