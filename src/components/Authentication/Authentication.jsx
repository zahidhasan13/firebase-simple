/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "../../firebase/firebase.config.js";
import { Toaster, toast } from "react-hot-toast";

const auth = getAuth(app);

const Authentication = () => {
  const [toggle, setToggle] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef();

  const handleToggle = () => {
    setToggle(!toggle);
  };

  // Register handlers
  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name.value;
    // Validation

    if (
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%@&? "])[a-zA-Z0-9!#$%@&?]{8,20}$/.test(
        password
      )
    ) {
      setError(
        toast("At least one special character, one digit, one lowercase character, one uppercase character, Minimum 8 characters, Maximum 20 characters")
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setSuccess(toast("Register Successful"));
        setError("");
        e.target.reset();
        emailVerification(user);
        updateUserData(user, name);
      })
      .catch((err) => {
        setError(toast("Already use this mail"));
        setSuccess("");
      });
  };

  // Login handlers
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const email = e.target.email.value;
    const password = e.target.password.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        setSuccess(toast("Login Successful"));
        setError("");
        e.target.reset();
      })
      .catch((err) => {
        setError(toast("Invalid username or password"));
        setSuccess("");
      });
  };

  // User Data
  const updateUserData = (user, name) => {
    updateProfile(user, {
      displayName: name,
    })
      .then(() => {
        console.log("user updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Email Varification
  const emailVerification = (user) => {
    sendEmailVerification(user).then(() => {
      toast("Check your mail");
    });
  };

  // Reset Password
  const handleResetPassword = (e) => {
    const email = emailRef.current.value;
    if (!email) {
      toast("Please enter your email");
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast("Check your mail")
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="text-center mt-10">
      <button
        onClick={handleToggle}
        className="bg-blue-500 py-2 px-8 rounded text-white font-bold"
      >
        {toggle ? "Register" : "Log In"}
      </button>
      <div>
        {toggle ? (
          <Login
            handleLogin={handleLogin}
            error={error}
            success={success}
            emailRef={emailRef}
            handleResetPassword={handleResetPassword}
          />
        ) : (
          <Register
            handleRegister={handleRegister}
            error={error}
            success={success}
          />
        )}
      </div>
      <div><Toaster/></div>
    </div>
  );
};

export default Authentication;
