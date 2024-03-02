import React from "react";

const Friends = ({ friend }) => {
  return (
    <div className="friend">
      <div className="friend_image">
        <div className="image">
          <img src={friend.image} alt="" />
        </div>
      </div>
      <div className="friend_name">
        <h4>{friend.username}</h4>
      </div>
    </div>
  );
};

export default Friends;
