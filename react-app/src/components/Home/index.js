import React from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import './Home.css';

const Home = () => {
    const history = useHistory();
    const user = useSelector((state)=> state.session.user)

    if(!user){
        history.push('/login')
    }

    return (
        <>
            <div className='home__container'>
                <div className='main__home'>
                    <div className='home__profile__image__container'>
                        <img
                            className='home__profile__image'
                            src={user.profileImage} alt='profileImage'>
                        </img>
                        <div className='home__edit'>
                            <button>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className='home__username'>
                            {user.username}
                        </label>
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

export default Home;
