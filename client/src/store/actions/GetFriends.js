import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export const GetFriends = async () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  try {
    const { data } = await axios.get(`${base_url}/chat/get-friends`);
  } catch (error) {
    console.log(error.message);
  }
};
