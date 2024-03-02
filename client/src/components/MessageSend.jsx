import React from "react";
import { BiMessageAltEdit, BiSend } from "react-icons/bi";
import { BsPlusCircle, BsSend } from "react-icons/bs";
import { RiGalleryLine } from "react-icons/ri";
import { AiFillGift } from "react-icons/ai";

const MessageSend = ({
  sendImage,
  handleInput,
  newMessage,
  sendMessage,
  sendEmoji,
}) => {
  const emojis = ["😄", "❤️", "😚", "😍", "🥰", "🫰", "👬", "😗", "🤟", "🏩"];
  return (
    <div className="message_send_section">
      <input type="checkbox" id="emoji" />
      <div className="file hover_attachment">
        <div className="add_attachment">Add Attachment</div>
        <BsPlusCircle size={20} />
      </div>
      <div className="file  hover_image">
        <div className="add_image">Add Image</div>
        <input onChange={sendImage} type="file" id="pic" className="form_control" />
        <label htmlFor="pic">
          <RiGalleryLine size={20} />
        </label>
      </div>
      <div className="file">
        <BiMessageAltEdit size={20} />
      </div>
      <div className="file hover_gift">
        <div className="add_gift">Add Gift</div>
        <AiFillGift size={20} />
      </div>
      <div className="message_type">
        <input
          onChange={handleInput}
          value={newMessage}
          type="text"
          name="message"
          id="message"
          placeholder="Aa"
          className="form_control"
        />
        <label htmlFor="emoji">😄</label>
      </div>
      <div onClick={sendMessage} className="file">
        {newMessage?.length > 0 ? <BiSend /> : "❤️"}
      </div>
      <div className="emoji_section">
        <div className="emoji">
          {emojis?.map((emj, i) => (
            <span onClick={() => sendEmoji(emj)} key={i}>
              {emj}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageSend;
