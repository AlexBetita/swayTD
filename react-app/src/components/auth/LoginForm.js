import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login, demologin } from "../../store/session";

import linkedin from '../img/linkedin.png';
import email_icon from '../img/email.png';
import github from '../img/github.png';


import "./LoginForm.css";

const LoginForm = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)

  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));

    if (data.errors) {
      setErrors(data.errors);
    }
  };

  const openEmail = () =>{
    window.open('mailto:alexbheb25@gmail.com')
  }


  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/profile" />;
  }

  return (
    <>
     {/* <div className='white__dot'>
    </div> */}
    <div className='home__container'>

        <div className='main__home'>

            <div className='title'>
              SWAY TD
            </div>
            <form className='login__form' onSubmit={onLogin}>
              <div>
                {errors.map((error) => (
                  <div>{error}</div>
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
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={updatePassword}
                />
              </div>
              <button type="submit">Login</button>
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
