import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { RiCheckboxCircleFill } from "react-icons/ri";

const Message = ({ messages, currentFriend, scrollRef, typing }) => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <div className="message_show">
        {messages?.length > 0 ? (
          messages.map((msg, i) =>
            msg.senderId === currentUser?._id ? (
              <div ref={scrollRef} className="my_message" key={i}>
                <div className="image_message">
                  <div className="my_text">
                    <p className="message_text my">
                      {msg.message?.text === "" ? (
                        <img src={msg.message?.image} alt="pic" />
                      ) : (
                        msg.message?.text
                      )}
                    </p>
                    {i === messages.length - 1 &&
                    msg.senderId === currentUser._id &&
                    msg.status === "seen" ? (
                      <img
                        className="img"
                        src={currentFriend?.image}
                        alt="friend"
                      />
                    ) : msg.status === "delivered" ? (
                      <span>
                        <RiCheckboxCircleFill />
                      </span>
                    ) : (
                      msg.status === "unseen" && (
                        <span>
                          <HiOutlineCheckCircle />
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="time">
                  {moment(msg.updatedAt).startOf("mini").fromNow()}
                </div>
              </div>
            ) : (
              <div ref={scrollRef} className="fd_message" key={i}>
                <div className="image_message_time">
                  <img src={currentFriend?.image} alt="" />
                  <div className="message_time">
                    <div className="fd_text">
                      <p className="message_text fd">
                        {msg.message?.text === "" ? (
                          <img src={msg.message?.image} alt="pic" />
                        ) : (
                          msg.message?.text
                        )}
                      </p>
                    </div>
                    <div className="time">
                      {moment(msg.updatedAt).startOf("mini").fromNow()}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <div className="friend_connect">
            <img src={currentFriend?.image} alt="friend" />
            <h3>{currentFriend?.username}</h3>
            <span className="time_ago">
              Connected{" "}
              {moment(currentFriend.createdAt).startOf("mini").fromNow()}
            </span>
          </div>
        )}
      </div>
      {typing?.msg?.length > 0 && typing?.senderId === currentFriend._id && (
        <div className="typing_message">
          <div className="fd_message">
            <div className="image_message_time">
              <img src={currentFriend?.image} alt="" />
              <div className="message_time">
                <div className="fd_text">
                  <p className="message_text">Typing...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
