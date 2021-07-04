/*
    https://iconmonstr.com/license/
*/

import React, {useEffect, useState, useRef} from 'react';
import { useHistory} from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { logout, edit } from '../../store/session';
import { isEmail } from '../utils';

import linkedin from '../img/linkedin.png';
import email_icon from '../img/email.png';
import github from '../img/github.png';
import logoutIcon from '../img/logout.png';
import arrow from '../img/arrow.png';

import './EditForm.css';

const EditForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state)=> state.session.user)

    const changePassB = useRef();
    const changePass = useRef();

    const [username, setUsername] = useState(user.username);
    const [profileImage, setProfileImage] = useState(user.profileImage);
    const [email, setEmail] = useState(user.email);
    const [errors, setErrors] = useState([]);
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState(false);


    useEffect(()=>{
        return () => {
            changePassB.current = false
            changePass.current = false
        }
    },[])

    if(!user){
        history.push('/login')
    }

    const onLogout = () =>{
        setTimeout(async ()=>{
            await dispatch(logout())
        }, 0)

        history.push('/login')
    }

    const onEdit = async (e) =>{
        e.preventDefault()
        let newErrors = []
        let id = user.id;

        if(!isEmail(email)){
            newErrors.push('Please provide a valid email')
        }

        if(username.length < 3){
            newErrors.push("Username is too short. Minimum is 3")
        } else if(username.length > 40){
            newErrors.push("Username is too long. Maximum is 40")
        }

        if(!profileImage){
            newErrors.push("Please provide a profile image")
        }

        if(checkPassword){
            if(password.length < 5){
                newErrors.push('Password too short. Minimum is 5')
            }
            if(password !== repeatPassword){
                newErrors.push("Passwords don't match")
            }
        }

        if(!newErrors.length){
            const data = await dispatch(edit({id, username, email, profileImage}))
            try{
                if(data.errors){
                    setErrors(data.errors)
                }
            } catch {
                setErrors([])
            }
        } else{
            setErrors(newErrors)
        }
    }

    const updateProfileImage = (e) => {
        const file = e.target.files[0]; /* grabs first file and setting as profile image*/
        if (file) setProfileImage(file)
    }

    const toggleChangePass = () =>{
        if(changePassB.current.classList.contains('active')){
            changePassB.current.classList.remove('active')
            changePass.current.classList.add('hidden')
            setCheckPassword(false)
        } else {
            changePassB.current.classList.add('active')
            changePass.current.classList.remove('hidden')
            setCheckPassword(true)
        }
    }

    const openEmail = () =>{
        window.open('mailto:alexbheb25@gmail.com')
    }

    return (
        <>
        <div className='home__container'>
            <NavLink
                    className='back__arrow__logout'
                    to='/profile'>
                <img src={arrow} alt='arrow'>
                </img>
            </NavLink>
            <div className='main__home'>
                <form className='logout__form' onSubmit={onEdit}>
                    <div>
                        {errors.map((error, id) => (
                        <div key={id}>{error}</div>
                        ))}
                    </div>
                    <div className='logout__edit'>
                        <img
                            className='logout__edit'
                            src={logoutIcon} alt='logout'
                            onClick={onLogout}
                            >
                        </img>
                    </div>
                    <img
                        className='home__profile__image'
                        src={user.profileImage} alt='profileImage'>
                    </img>
                    <div>
                        <label className="label__signup__form">Profile Image</label>
                            <input
                                className="input__signup__form"
                                type="file"
                                onChange={updateProfileImage}
                            >
                        </input>
                    </div>
                    <div className='home__profile__image__container'>
                    </div>

                    <div>
                        <input
                            value={username}
                            name='username'
                            className='edit__username'
                            onChange={(e)=> setUsername(e.target.value)}
                        >

                        </input>
                        <label className='star__logout'>☆</label>
                    </div>
                    <div>
                        <input
                            value={email}
                            name='email'
                            className='edit__email'
                            onChange={(e)=> setEmail(e.target.value)}
                        >

                        </input>
                    </div>

                    <button type="button" ref={changePassB} onClick={toggleChangePass}>
                        Change Password
                    </button>
                    <div className='edit__password__div hidden' ref={changePass}>
                        <label> Change New Password</label>
                        <div>
                            <input
                                className='edit__password'
                                type="password"
                                name="password"
                                onChange={(e)=> setPassword(e.target.value)}
                                value={password}
                            ></input>
                        </div>
                        <label>Repeat New Password</label>
                        <div>
                            <input
                                className='edit__password'
                                type="password"
                                name="repeat_password"
                                onChange={(e)=> setRepeatPassword(e.target.value)}
                                value={repeatPassword}
                            ></input>
                        </div>
                    </div>
                    <button type='submit'>
                        SUBMIT
                    </button>
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
                        onClick={(e)=> openEmail()}
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
    )
}

export default EditForm;
