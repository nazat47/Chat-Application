import React from "react";
import moment from "moment";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { RiCheckboxCircleFill } from "react-icons/ri";

const Friends = ({ friend, userId, activeUsers }) => {
  const { frndInfo, lMsg } = friend;
  const active = activeUsers?.some((active) => active.userId === frndInfo._id);
  return (
    <div className="friend">
      <div className="friend_image">
        <div className="image">
          <img src={frndInfo?.image} alt="" />
          {active && <div className="active_icon"></div>}
        </div>
      </div>
      <div className="friend_name_seen">
        <div className="friend_name">
          <h4
            className={
              lMsg?.senderId !== userId &&
              lMsg?.status !== undefined &&
              lMsg?.status !== "seen"
                ? "unseen_message fd_name"
                : "fd_name"
            }
          >
            {frndInfo?.username}
          </h4>
          <div className="msg_time">
            {lMsg && lMsg?.senderId === userId ? (
              <span>You: </span>
            ) : lMsg?.senderId === frndInfo?._id ? (
              <span
                className={
                  lMsg?.senderId !== userId &&
                  lMsg?.status !== undefined &&
                  lMsg?.status !== "seen"
                    ? "unseen_message"
                    : ""
                }
              >
                {frndInfo?.username}:{" "}
              </span>
            ) : (
              ""
            )}
            {lMsg?.message?.text ? (
              <span
                className={
                  lMsg?.senderId !== userId &&
                  lMsg?.status !== undefined &&
                  lMsg?.status !== "seen"
                    ? "unseen_message"
                    : ""
                }
              >
                {" "}
                {lMsg?.message?.text?.slice(0, 10)}
              </span>
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
