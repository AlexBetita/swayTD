/*
    https://iconmonstr.com/license/
*/

import React, {useEffect} from 'react';
import { useHistory} from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import { logout } from '../../store/session';

import coin from '../img/coin.png';
import linkedin from '../img/linkedin.png';
import email from '../img/email.png';
import github from '../img/github.png';
import logoutIcon from '../img/logout.png';
import { setMapData } from "../../store/map";

import './Home.css';

const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const user = useSelector((state)=> state.session.user)


    if(!user){
        history.push('/login')
    }

    const openEmail = () =>{
        window.open('mailto:alexbheb25@gmail.com')
    }

    const onLogout = () =>{
        setTimeout(async ()=>{
            await dispatch(logout())
        }, 0)

        history.push('/login')
    }

    useEffect(()=>{
        const setMap = async () =>{
            await dispatch(setMapData(1))
        }
        setMap()
    })

    const editProfile = () =>{
        history.push('/edit_profile')
    }

    return (
        <>
        {user &&
            <div className='home__container'>
                <div className='main__home'>
                    <div className='home__profile__image__container'>
                        <img
                            className='home__profile__image'
                            src={user.profileImage} alt='profileImage'>
                        </img>
                        <div className='home__edit'>
                            <Tippy content="Edit Your Profile"
                                        inertia={true}
                                        arrow={true}
                                        theme='sway'
                                    >
                                <button className='edit__profile__button' onClick={editProfile}>
                                    Edit Profile
                                </button>
                            </Tippy>

                            <Tippy content="Logout"
                                    inertia={true}
                                    arrow={true}
                                    theme='sway'
                                    >
                                <img
                                    className='logout__home'
                                    src={logoutIcon} alt='logout'
                                    onClick={onLogout}
                                    >
                                </img>
                            </Tippy>

                        </div>
                    </div>
                    <div>
                        <label className='home__username'>
                            {user.username}
                        </label>
                        <label className='star__home'>☆</label>
                    </div>

                    <div>
                        <img className='home__coin' src={coin} alt='coin'>

                        </img>
                        <label className='home__currency'>
                            {user.currency}
                        </label>
                    </div>
                    <div>
                        <NavLink to='/maps'>
                            <label className='home__maps'>
                                Maps
                            </label>
                        </NavLink>
                    </div>

                    <div>
                        <label className='home__start__game'>
                            Start Game
                        </label>
                    </div>


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
                            <img src={email} alt='email'></img>
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
            }
        </>
    )
}

export default Home;
