import React from "react";
import { useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import ActiveFriends from "./ActiveFriends";
import Friends from "./Friends";
import RightSide from "./RightSide";

const Chat = () => {
  const { currentUser } = useSelector((state) => state.user);
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
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
              <div className="hover_friend">
                <Friends />
              </div>
            </div>
          </div>
        </div>
        <RightSide />
      </div>
    </div>
  );
};

export default Chat;
