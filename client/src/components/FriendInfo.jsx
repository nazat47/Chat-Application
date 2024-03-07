import React from "react";
import { BsChevronDown } from "react-icons/bs";

const FriendInfo = ({ currentFriend, activeUsers, messages }) => {
  // let images = [];
  // messages.map((msg) => {
  //   if (
  //     currentFriend._id === msg.senderId ||
  //     currentFriend._id === msg.receiverId
  //   ) {
  //     images.push(msg.message.image);
  //   }
  // });

  return (
    <div className="friend_info">
      <input type="checkbox" name="" id="gallery" />
      <div className="image_name">
        <div className="image">
          <img src={currentFriend.image} alt="friend" />
        </div>
        {activeUsers?.length > 0 &&
          activeUsers.some((u) => u.userId === currentFriend._id) && (
            <div className="active_user">Active now</div>
          )}
        <div className="name">
          <h4>{currentFriend.username}</h4>
        </div>
      </div>
      <div className="others">
        <div className="custom_chat">
          <h3>Customize Chat</h3>
          <BsChevronDown />
        </div>
        <div className="privacy">
          <h3>Privacy and Support</h3>
          <BsChevronDown />
        </div>
        <div className="media">
          <h3>Shared Media</h3>
          <label htmlFor="gallery">
            <BsChevronDown />
          </label>
        </div>
      </div>
      <div className="gallery">
        {messages?.length > 0 &&
          messages.map(
            (msg,i) =>
              msg.message?.image && <img key={i} src={msg.message.image} alt="" />
          )}
      </div>
    </div>
  );
};

export default FriendInfo;
