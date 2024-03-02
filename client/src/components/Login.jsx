import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import {
  processStart,
  signInFailure,
  signInSuccess,
} from "../store/reducers/userReducer";
import axios from "axios";

const Login = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const { isAuthenticated } = useSelector((state) => state.user);
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      dispatch(processStart());
      const { data } = await axios.post(
        `${base_url}/auth/login`,
        formData,
        {config,withCredentials:true}
      );
      if (data?.msg) {
        alert.error(data?.msg);
        dispatch(signInFailure(data?.msg));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data?.msg));
      alert.error(error.response.data?.msg);
      console.log(error.message);
    }
  };
  return (
    <div className="login">
      <div className="card">
        <div className="card_header">
          <h3>Login</h3>
        </div>
        <div className="card_body">
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="form_control"
                onChange={handleInput}
              />
            </div>
            <div className="form_group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                className="form_control"
                onChange={handleInput}
              />
            </div>
            <div className="form_group">
              <input type="submit" value="Login" className="btn" />
            </div>
            <div className="form_group">
              <span>
                <Link to="/register">Or register your account</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
