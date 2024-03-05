import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAlert } from "react-alert";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  processStart,
  signUpFailure,
  signUpSuccess,
} from "../store/reducers/userReducer";

const Register = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
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
        `${base_url}/auth/register`,
        formData,
        config
      );
      if (data?.msg) {
        console.log(data?.msg);
        dispatch(signUpFailure(data?.msg));
      } else {
        dispatch(signUpSuccess(data?.token));
        alert.success("Sign up sucessfull");
        navigate("/login");
      }
    } catch (error) {
      dispatch(signUpFailure(error.response.data?.msg));
      alert.error(error.response.data?.msg);
      console.log(error.message);
    }
  };
  const handleFile = (e) => {
    const file = e.target.files[0];
    const promise = storeImage(file);
    promise
      .then((url) => {
        console.log("Image uploaded successfully");
        setFormData({
          ...formData,
          image: url,
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <div className="register">
      <div className="card">
        <div className="card_header">
          <h3>Register</h3>
        </div>
        <div className="card_body">
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form_control"
                name="username"
                placeholder="Username"
                required
                id="username"
                value={formData.username}
                onChange={handleInput}
              />
            </div>
            <div className="form_group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form_control"
                name="email"
                placeholder="Email"
                id="email"
                required
                value={formData.email}
                onChange={handleInput}
              />
            </div>
            <div className="form_group">
              <label htmlFor="password">Password</label>
              <input
                type="text"
                className="form_control"
                name="password"
                placeholder="Password"
                required
                id="password"
                onChange={handleInput}
              />
            </div>
            <div className="form_group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="text"
                className="form_control"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                id="confirmPassword"
                onChange={handleInput}
              />
            </div>
            <div className="form_group">
              <div className="file_image">
                <div className="image">
                  <img src={formData.image} alt="user" />
                </div>
                <div className="file">
                  <label htmlFor="image">Select Image</label>
                  <input
                    onChange={handleFile}
                    name="image"
                    type="file"
                    id="image"
                    className="form_control"
                  />
                </div>
              </div>
            </div>
            <div className="form_group">
              <input type="submit" value="Register" className="btn" />
            </div>
            <div className="form_group">
              <span>
                <Link to="/login"> Login to your account </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
