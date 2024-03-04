import React from "react";
import moment from "moment";
import { HiOutlineCheckCircle } from "react-icons/hi";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxCircleFill,
} from "react-icons/ri";

const Friends = ({ friend, userId }) => {
  const { frndInfo, lMsg } = friend;
  return (
    <div className="friend">
      <div className="friend_image">
        <div className="image">
          <img src={frndInfo?.image} alt="" />
        </div>
      </div>
      <div className="friend_name_seen">
        <div className="friend_name">
          <h4>{frndInfo?.username}</h4>
          <div className="msg_time">
            {lMsg && lMsg?.senderId === userId ? (
              <span>You: </span>
            ) : lMsg?.senderId === frndInfo?._id ? (
              <span>{frndInfo?.username}: </span>
            ) : (
              ""
            )}
            {lMsg?.message?.text ? (
              <span> {lMsg?.message?.text?.slice(0, 10)}</span>
            ) : lMsg?.message?.image ? (
              <span>Sent an image</span>
            ) : (
              <span>Start a conversation</span>
            )}
            {lMsg && (
              <span className="time_ago">
                {moment(lMsg.createdAt).startOf("mini").fromNow()}
              </span>
            )}
          </div>
        </div>
        {userId === lMsg?.senderId ? (
          <div className="seen_unseen_icon">
            {lMsg?.status === "seen" ? (
              <img src={frndInfo.image} alt="friend" />
            ) : lMsg?.status === "delivered" ? (
              <div className="delivered">
                <RiCheckboxCircleFill />
              </div>
            ) : (
              <div className="unseen">
                <HiOutlineCheckCircle />
              </div>
            )}
          </div>
        ) : (
          <div className="seen_unseen_icon">
            {lMsg?.status !== undefined && lMsg?.status !== "seen" ? (
              <div className="seen_icon"></div>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
