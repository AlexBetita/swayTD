import React, { useState } from 'react';
import { Modal } from '../../context/Modal';

import bulb from '../img/bulb.png';

import './Tips.css';

function TipsModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className='tips'>
            <img className='bulb__icon' src={bulb} onClick={() => setShowModal(true)} alt='bulb'/>
      </div>
      {showModal && (
        <Modal toggleModal={() => {
            setShowModal(false)
            console.log('hmmm')
        }}>
            <div className='tips__modal__container'>

            </div>
        </Modal>
      )}
    </>
  );
}

export default TipsModal;
