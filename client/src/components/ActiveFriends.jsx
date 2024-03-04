import React from "react";

const ActiveFriends = ({ activeUsers, setCurrentFriend }) => {
  return (
    <div
      onClick={() => setCurrentFriend(activeUsers.userInfo)}
      className="active_friend"
    >
      <div className="image_active_icon">
        <div className="image">
          <img src={activeUsers.userInfo.image} alt="user" />
          <div className="active_icon"></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveFriends;
