import React, { useEffect, useState, useRef } from "react";
import { Redirect, useHistory} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login, demologin } from "../../store/session";
import { isEmail } from "../utils";

import linkedin from '../img/linkedin.png';
import email_icon from '../img/email.png';
import github from '../img/github.png';
import swaytd from '../img/swaytd.png';


import "./LoginForm.css";

const LoginForm = () => {

  const dispatch = useDispatch();
  const history = useHistory()
  const user = useSelector(state => state.session.user)
  const demoB = useRef();
  const signupB = useRef();
  const loginB = useRef();
  const balls = useRef();
  const emailInput = useRef();
  const passwordInput = useRef();

  // const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLoading = () =>{
    balls.current.classList.remove('hidden')
    demoB.current.setAttribute("disabled", true)
    signupB.current.setAttribute("disabled", true)
    loginB.current.setAttribute("disabled", true)
    emailInput.current.setAttribute("disabled", true)
    passwordInput.current.setAttribute("disabled", true)
  }

  const finishedLoading = () =>{
    balls.current.classList.add('hidden')
    demoB.current.removeAttribute("disabled")
    signupB.current.removeAttribute("disabled")
    loginB.current.removeAttribute("disabled")
    emailInput.current.removeAttribute("disabled")
    passwordInput.current.removeAttribute("disabled")
  }

  const onLogin = async (e) => {
    e.preventDefault();
    setErrors([])
    let newErrors = []

    if(!isEmail(email)){
      newErrors.push('Please provide a valid email')
    }

    if(!newErrors.length){
      await isLoading()
      const data = await dispatch(login(email, password));
      await finishedLoading()
      if (data.errors) {
        setErrors(data.errors);
      } else {
        history.push('/')
      }
    } else {
      setErrors(newErrors)
    }
  };

  const openEmail = () =>{
    window.open('mailto:alexbheb25@gmail.com')
  }

  const demo = async (e) => {
    e.preventDefault()
    isLoading()
    await dispatch(demologin())
    finishedLoading()
    history.push('/')
  }

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const signup = async () => {
    history.push('/signup')
  }

  useEffect(()=>{
    if (user) {
      return <Redirect to="/" />;
    }
  },[user])

  return (
    <>
     {/* <div className='white__dot'>
    </div> */}
    <div className='home__container'>

        <div className='main__home'>

            <div className='title'>
              <img className='title__image' src={swaytd} alt='title'/>
            </div>
            <form className='login__form' onSubmit={onLogin}>
              <div>
                {errors.map((error, id) => (
                  <div key={id}>{error}</div>
                ))}
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={updateEmail}
                  ref={emailInput}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="on"
                  value={password}
                  onChange={updatePassword}
                  ref={passwordInput}
                />
              </div>
              <div>
                <button type="submit" ref={loginB}>Login</button>
                <button onClick={signup} ref={signupB}>
                  Signup
                </button>
              </div>
              <button onClick={demo} ref={demoB}>
                    DEMO
                </button>
                  <div className='balls hidden' ref={balls}>
                    <div className='ball1'></div>
                    <div className='ball2'></div>
                    <div className='ball1'></div>
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
    </>
  );
};

export default LoginForm;
