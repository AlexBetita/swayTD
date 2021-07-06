import React, { useState, useRef } from "react";
import { Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { isEmail } from "../utils";
import { signUp } from '../../store/session';
import linkedin from '../img/linkedin.png';
import email_icon from '../img/email.png';
import github from '../img/github.png';

import "./SignUpForm.css"

const SignUpForm = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.session.user)
  const signupB = useRef();
  const loginB = useRef();
  const balls = useRef();
  const usernameInput = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();
  const repeatpasswordInput = useRef();
  const profileImageInput = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [errors, setErrors] = useState([]);

  const isLoading = () =>{
    balls.current.classList.remove('hidden')
    signupB.current.setAttribute("disabled", true)
    loginB.current.setAttribute("disabled", true)
    usernameInput.current.setAttribute("disabled", true)
    emailInput.current.setAttribute("disabled", true)
    passwordInput.current.setAttribute("disabled", true)
    repeatpasswordInput.current.setAttribute("disabled", true)
    profileImageInput.current.setAttribute("disabled", true)
  }

  const finishedLoading = () =>{
    balls.current.classList.add('hidden')
    signupB.current.removeAttribute("disabled")
    loginB.current.removeAttribute("disabled")
    usernameInput.current.removeAttribute("disabled")
    emailInput.current.removeAttribute("disabled")
    passwordInput.current.removeAttribute("disabled")
    repeatpasswordInput.current.removeAttribute("disabled")
    profileImageInput.current.removeAttribute("disabled")
  }

  const onSignUp = async (e) => {
    e.preventDefault();
    setErrors([])

    let newErrors = []

    if(!isEmail(email)){
      newErrors.push('Please provide a valid email')
    }

    if(password !== repeatPassword){
      newErrors.push("Passwords don't match")
    }

    if(username.length < 3){
      newErrors.push("Username is too short. Minimum is 3")
    } else if(username.length > 40){
      newErrors.push("Username is too long. Maximum is 40")
    }

    if(!profileImage){
      newErrors.push("Please provide a profile image")
    }

    if (!newErrors.length) {
      await isLoading();

      const data = await dispatch(signUp(username, email, password, profileImage));

      await finishedLoading();

      if (data.errors) {
        setErrors(data.errors);
      } else {

        setTimeout(()=>{
          history.push('/')
        },0)
      }
    } else {
      setErrors(newErrors)
    }
  };

  const openEmail = () =>{
    window.open('mailto:alexbheb25@gmail.com')
  }

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  const updateProfileImage = (e) => {
    const file = e.target.files[0]; /* grabs first file and setting as profile image*/
    if (file) setProfileImage(file)
  }

  const login = () => {
    setTimeout(()=>{
      history.push('/login')
    },0)
  }

  if (user) {
    setTimeout(()=>{
      return <Redirect to="/" />;
    },0)
  }

  return (
    <div className='home__container'>
        <div className='main__home'>
          <div className='title'>
                SWAY TD
          </div>
          <form className='signup__form' onSubmit={onSignUp}>
              <div>
                {errors.map((error, id) => (
                  <div key={id}>{error}</div>
                ))}
              </div>
            <div>
              <label>User Name</label>
              <input
                type="text"
                name="username"
                onChange={updateUsername}
                value={username}
                ref={usernameInput}
              ></input>
            </div>
            <div>
              <label>Email</label>
              <input
                type="text"
                name="email"
                onChange={updateEmail}
                value={email}
                ref={emailInput}
              ></input>
            </div>
            <div>
              <label className="label__signup__form">Profile Image</label>
              <input
                className="input__signup__form"
                type="file"
                onChange={updateProfileImage}
                ref={profileImageInput}
              ></input>
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                autoComplete="off"
                onChange={updatePassword}
                value={password}
                ref={passwordInput}
              ></input>
            </div>
            <div>
              <label>Repeat Password</label>
              <input
                type="password"
                name="repeat_password"
                autoComplete="off"
                onChange={updateRepeatPassword}
                value={repeatPassword}
                required={true}
                ref={repeatpasswordInput}
              ></input>
            </div>
            <div className='signup__buttons'>
              <button type="submit" ref={signupB}>Sign Up</button>
              <button onClick={login} ref={loginB}>
                Login
              </button>
              <div className='balls hidden' ref={balls}>
                  <div className='ball1'></div>
                  <div className='ball2'></div>
                  <div className='ball1'></div>
              </div>
            </div>
          </form>

              <div className='footer'>
                <div>
                    About me
                </div>
                  <div
                      onClick={()=>{
                      window.location.href = 'https://github.com/AlexBetita/'
                  }}>
                      <img src={github} alt='github'>
                      </img>
                  </div>

                  <div
                      onClick={()=>{
                      window.location.href = 'https://www.linkedin.com/in/alex-betita/'
                      }}
                  >
                      <img src={linkedin} alt='linkedin'>
                      </img>
                  </div>

                    <div
                        onClick={()=> openEmail()}
                    >
                      <img src={email_icon} alt='email'></img>
                  </div>
              </div>
        </div>

        <div className='side__home'>
                <div>
                    <label>
                        LEADER BOARDS
                    </label>
                </div>
                <div>
                    <label>
                        Map Dimensions
                    </label>
                </div>
          </div>
    </div>
  );
};

export default SignUpForm;
