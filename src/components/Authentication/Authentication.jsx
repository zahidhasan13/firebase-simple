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
        "At least one special character, one digit, one lowercase character, one uppercase character, Minimum 8 characters, Maximum 20 characters"
      );
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setSuccess("Registration successful");
        setError("");
        e.target.reset();
        emailVerification(user);
        updateUserData(user, name);
      })
      .catch((err) => {
        setError("Already use this email");
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
        setSuccess("Login successful");
        setError("");
        e.target.reset();
      })
      .catch((err) => {
        setError("Invalid username or password");
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
      alert("Check your email");
    });
  };

  // Reset Password
  const handleResetPassword = (e) => {
    const email = emailRef.current.value;
    if (!email) {
      alert("Please enter your email");
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Check your email");
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
    </div>
  );
};

export default Authentication;
