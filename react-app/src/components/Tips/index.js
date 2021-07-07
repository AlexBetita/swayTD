import React, { useState, useRef } from 'react';

import { Modal } from '../../context/Modal';

import bulb from '../img/bulb.png';
import start from '../img/flag_green.png';
import stop from '../img/target_red.png';
import pencil from '../img/pencil_orange.png';
import eraser from '../img/eraser_pink.png';
import grid from '../img/grid.png';
import path from '../img/path.png';
import save from '../img/save.png';
import paint from '../img/paint.png';
import square from '../img/square.png';
import edit from '../img/edit.png';
import delete_icon from '../img/delete_red.png';
import load from '../img/load.png';
import search from '../img/search.png';
import grid_red from '../img/grid_red.png';
import undo from '../img/undo.png';
import copy_color from '../img/copy_color_blue.png';
import reload from '../img/reload_blue.png';
import undo_draw from '../img/undo_purple.png';


import './Tips.css';

function TipsModal() {
  const [showModal, setShowModal] = useState(false);
  const button1 = useRef();
  const button2 = useRef();
  const button3 = useRef();
  const button4 = useRef();
  const button5 = useRef();

  const navigateSlider = (e) => {
    if(e.target.classList.contains('1')){
      button1.current.classList.add('active')

      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
    } else if(e.target.classList.contains('2')){
      button2.current.classList.add('active')

      button1.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
    } else if(e.target.classList.contains('3')){
      button3.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
    } else if(e.target.classList.contains('4')){
      button4.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button5.current.classList.remove('active')
    } else {
      button5.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
    }
  }

  return (
    <>
      <div className='tips'>
            <img className='bulb__icon' src={bulb} onClick={() => setShowModal(true)} alt='bulb'/>
      </div>
      {showModal && (
        <Modal toggleModal={() => {
            setShowModal(false)
        }}>
            <div className='tips__modal__container'>
              <section className="slider">
                <ol className="tips__list">
                  <li id="tip1"
                      tabIndex="0"
                      className="tips__slide">
                      <div className='tips__content'>
                        <div>
                          <article className='tips__intro'>
                            Hi player! Welcome to Swarm TD's map editor where you can create, edit,
                            delete maps, and check out other players custom created map. Here you will learn
                            how to interact with the given tools below.
                          </article>
                        </div>
                      </div>
                  </li>
                  <li id="tip2"
                      tabIndex="0"
                      className="tips__slide">
                      <div className='tips__content'>
                        Hello
                      </div>
                  </li>
                  <li id="tip3"
                      tabIndex="0"
                      className="tips__slide">
                      <div className='tips__content'>
                        Bye
                      </div>
                  </li>
                  <li id="tip4"
                      tabIndex="0"
                      className="tips__slide">
                      <div className='tips__content'>
                        Cool
                      </div>
                  </li>
                  <li id="tip5"
                      tabIndex="0"
                      className="tips__slide">
                      <div className='tips__content'>
                        Nice
                      </div>
                  </li>

                </ol>
                <div className="tips__navigation">
                  <ol className="tips__navigation-list">
                    <li className="tips__navigation-item">
                      <a href="#tip1"
                        className="tips__navigation-button 1 active" ref={button1}
                        onClick={navigateSlider}
                        ></a>
                    </li>
                    <li className="tips__navigation-item">
                      <a href="#tip2"
                        className="tips__navigation-button 2" ref={button2}
                        onClick={navigateSlider}
                        ></a>
                    </li>
                    <li className="tips__navigation-item">
                      <a href="#tip3"
                        className="tips__navigation-button 3" ref={button3}
                        onClick={navigateSlider}
                        ></a>
                    </li>
                    <li className="tips__navigation-item">
                      <a href="#tip4"
                        className="tips__navigation-button 4" ref={button4}
                        onClick={navigateSlider}
                        ></a>
                    </li>
                    <li className="tips__navigation-item">
                      <a href="#tip5"
                        className="tips__navigation-button 5" ref={button5}
                        onClick={navigateSlider}
                        ></a>
                    </li>
                  </ol>
                </div>
              </section>
            </div>
        </Modal>
      )}
    </>
  );
}

export default TipsModal;
