import React, { useState, useRef } from 'react';

import { Modal } from '../../context/Modal';

//icons
import help from '../img/help.png';
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
import search from '../img/search.png';
import grid_red from '../img/grid_red.png';
import copy_color from '../img/copy_color_blue.png';
import reload from '../img/reload_blue.png';
import undo_draw from '../img/undo_purple.png';

import dimensions from '../img/dimensions.png';

//gifs


import './Tips.css';

function TipsModal() {
  const [showModal, setShowModal] = useState(false);
  const button1 = useRef();
  const button2 = useRef();
  const button3 = useRef();
  const button4 = useRef();
  const button5 = useRef();
  const button6 = useRef();
  const button7 = useRef();
  const button8 = useRef();

  const navigateSlider = (e) => {
    if(e.target.classList.contains('1')){
      button1.current.classList.add('active')

      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
      button6.current.classList.remove('active')
      button7.current.classList.remove('active')
      button8.current.classList.remove('active')

    } else if(e.target.classList.contains('2')){
      button2.current.classList.add('active')

      button1.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
      button6.current.classList.remove('active')
      button7.current.classList.remove('active')
      button8.current.classList.remove('active')

    } else if(e.target.classList.contains('3')){
      button3.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
      button6.current.classList.remove('active')
      button7.current.classList.remove('active')
      button8.current.classList.remove('active')

    } else if(e.target.classList.contains('4')){
      button4.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button5.current.classList.remove('active')
      button6.current.classList.remove('active')
      button7.current.classList.remove('active')
      button8.current.classList.remove('active')

    } else if(e.target.classList.contains('5')){
      button5.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button6.current.classList.remove('active')
      button7.current.classList.remove('active')
      button8.current.classList.remove('active')

    } else if(e.target.classList.contains('6')){
      button6.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
      button7.current.classList.remove('active')
      button8.current.classList.remove('active')

    } else if(e.target.classList.contains('7')){
      button7.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
      button6.current.classList.remove('active')
      button8.current.classList.remove('active')
    } else if(e.target.classList.contains('8')){
      button8.current.classList.add('active')

      button1.current.classList.remove('active')
      button2.current.classList.remove('active')
      button3.current.classList.remove('active')
      button4.current.classList.remove('active')
      button5.current.classList.remove('active')
      button6.current.classList.remove('active')
      button7.current.classList.remove('active')
    }
  }

  return (
    <>
      <div className='tips'>
            <img className='bulb__icon' src={help} onClick={() => setShowModal(true)} alt='help'/>
      </div>
      {showModal && (
        <Modal toggleModal={() => {
            setShowModal(false)
        }}>
            <div className='tips__modal__container'>
              <section className="navigator">
                <ol className="tips__list">
                  <li id="tip1"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                          <article className='tips__intro'>
                            Hi player! Welcome to Swarm TD's map editor where you can create, edit,
                            delete maps, and check out other players custom created map. Here you will learn
                            how to interact with the given tools below. Depending on your current page certain tools
                            will not appear but we will be going through all of them here.
                          </article>

                          <div className='tips__flex'>
                              <img className='tips__images' src={dimensions} alt='dimensions'/>
                              <p>
                                Here we have the dimensions table. You can change your rows/columns with a min
                                of 5 and max of 100, width/height with a min of 50 and max of 800.
                                Note that changing the size of the canvas resets your progress. So make sure your
                                set on the dimensions player.
                              </p>
                          </div>

                          <div className='tips__line'></div>

                          <div className='tips__flex'>
                              <img className='tips__images' src={pencil} alt='pencil'/>
                              <p>
                                Let's start off with our first tool. The pencil, this is our bread and butter tool
                                this is what you'll mostly be using to interact with the majority of the buttons here.
                                Clicking on it will activate the ability to interact with the canvas and other buttons.
                                Once activated you can draw on the board, go ahead and try it! Neat right?
                              </p>
                          </div>

                          <p className='p__tips'>
                            Now let's move on to the other page to see what else we have in store. Click on the buttons below
                            to navigate through the tips section.
                          </p>

                        </div>
                      </div>
                  </li>
                  <li id="tip2"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                          <div className='tips__flex'>
                                  <img className='tips__images' src={copy_color} alt='copy_color'/>
                                  <p>
                                    Here we have our second tool on the UI before you can start playing around with this,
                                    the pencil tool must be activated now I'll be repeating myself on this but lets keep it simple
                                    and say that every tool that interacts with the canvas the pencil tool must be activated. Alright
                                    now that we have know that this tool allows us to copy the selected cells color, take note that
                                    a blank canvas will always result in black as the primary color when copied. We can play around with
                                    this when we have a bunch of colorful tiles on the canvas. Cool!
                                  </p>
                          </div>

                          <div className='tips__line'></div>

                          <div className='tips__flex'>
                                  <img className='tips__images' src={reload} alt='reload'/>
                                  <p>
                                    This tool over here is an awesome one and only appears when your editing your saved up map. This allows
                                    us to reload the saved state of the map incase we mess up and wanna go back to how our map was saved.
                                    Gotta make sure you save your maps player whenever your satisfied with the results.
                                  </p>
                          </div>


                        </div>
                      </div>
                  </li>
                  <li id="tip3"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                            <div className='tips__flex'>
                                    <img className='tips__images' src={undo_draw} alt='undo_draw'/>
                                    <p>
                                      This tool allow us to undo the latest path drawn on the canvas, it's a great tool whenever you wanna undo the
                                      previous path you just created. As long as you keep drawing a path on one hold of the mouse button
                                      then you'll be able to undo that path that was just created but when you create a new path right after that
                                      only the latest path is undone.
                                    </p>
                            </div>

                            <div className='tips__line'></div>

                            <div className='tips__flex'>
                                    <img className='tips__images' src={eraser} alt='eraser'/>
                                    <p>
                                      This tool is the eraser, and just from the name alone it allows us to erase the paths that we don't want on the
                                      canvas. Note that when you erase a tile from the canvas you are also erasing that path therefore if your path is
                                      reliant on that particular tile that was just erased make sure to re add a tile back incase you wanna utilize the
                                      map for the game.
                                    </p>
                            </div>

                        </div>
                      </div>
                  </li>
                  <li id="tip4"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                              <div className='tips__flex'>
                                      <img className='tips__images' src={square} alt='square'/>
                                      <p>
                                        This tool that looks like a plain empty box with black borders, well if you guess that this tool clears the whole
                                        canvas then yes your are correct and it does just that. Wanna start over from scratch and create an awesome map? This
                                        tool is made for you.
                                      </p>
                              </div>

                              <div className='tips__line'></div>

                              <div className='tips__flex'>
                                      <img className='tips__images' src={paint} alt='paint'/>
                                      <p>
                                        This tool right here has a box above it that contains a color in the middle and that color specifies the current color
                                        that this paint tool when activated will apply. We can press on that box and it'll popup an assortment of colors that
                                        we can choose to paint with. Make sure to activate the pencil tool and pick a color, once you decide what color activate
                                        the paint tool and let out your creative freedom on that canvas.
                                      </p>
                              </div>

                        </div>
                      </div>
                  </li>
                  <li id="tip5"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                                <div className='tips__flex'>
                                        <img className='tips__images' src={path} alt='path'/>
                                        <p>
                                          The path tool. A really cool tool that when clicked on opens up a menu of pathing algorithms, and in that menu you have 3 buttons that say DFS
                                          which is short for depth first search, BFS which is short for breatdh first search and linked list so from start to end node. We have
                                          here a scroll that from 0-100 determines the speed from instant to really slow at which you wanna visualize these algorithms, we have a
                                          color picker here as well and a really cool button on the side that kinda looks like an arrow going counter clockwise,
                                          that button undos the path that was traveled
                                          a really awesome tool go ahead and play around with it player.
                                        </p>
                                </div>

                                <div className='tips__line'></div>

                                <div className='tips__flex'>
                                        <img className='tips__images' src={start} alt='start'/>
                                        <p>
                                          This is the bread and butter for the pathing algorithms this button together with its pair the end button or the red target,
                                          must be placed inorder for the path to fully be connected. This is the start node button, use this to place where you want your starting
                                          position to be. You can easily change the start position by just re clicking the button and clicking on the canvas and it'll change to a
                                          new start position.
                                        </p>
                                </div>

                        </div>
                      </div>
                  </li>

                  <li id="tip6"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                                <div className='tips__flex'>
                                        <img className='tips__images' src={stop} alt='stop'/>
                                        <p>
                                          The is the bread and butter for the pathing algorithms with the start button. This is the end button, it'll allow us to determine
                                          where our path ends from the start point up until wherever you placed this as long as the paths connect. Just like the start button you can easily
                                          re allocate the end postion by just clicking on the button and placing it on the canvas.
                                        </p>
                                </div>

                                <div className='tips__line'></div>

                                <div className='tips__flex'>
                                        <img className='tips__images' src={grid} alt='grid'/>
                                        <p>
                                          This button draws a grid on the canvas based on the rows and columns. You can also use this to determine what your tile size will look like and how you'll
                                          plot out the map. Note this does not affect the state of the path but more for just visualization.
                                        </p>
                                </div>

                        </div>
                      </div>
                  </li>


                  <li id="tip7"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                                <div className='tips__flex'>
                                        <img className='tips__images' src={grid_red} alt='grid_red'/>
                                        <p>
                                          This button is the opposite of the grid button, it creates a white grid instead or rather its main functionality is to erase the grid, it gives of this cool effect
                                          where lines are seen passing through the tiles. Note this does not affect the state of the path but more for just visualization.
                                        </p>
                                </div>

                                <div className='tips__line'></div>

                                <div className='tips__flex'>
                                        <img className='tips__images' src={search} alt='search'/>
                                        <p>
                                          Here we have a magnifying button, it's not a zoom in button, but rather a search button. On click it will toggle a popup and inside that popup we have a input bar
                                          that says search and a button below it. We can search for another users created map by inputting the map name or id and with the click of the button it'll then
                                          navigate us to that map, for either viewing or editing based on who the owner of that map is.
                                        </p>
                                </div>

                        </div>
                      </div>
                  </li>

                  <li id="tip8"
                      tabIndex="0"
                      className="tips__items">
                      <div className='tips__content'>
                        <div className='tips__container__flex'>
                                <div className='tips__flex'>
                                        <img className='tips__images' src={save} alt='save'/>
                                        <p>
                                          This button over here appears when your creating a new map from scratch. This allows us to save the map, after saving the map it'll navigate us to the edit page of the
                                          newly created map.
                                        </p>
                                </div>

                                <div className='tips__line'></div>

                                <div className='tips__flex'>
                                        <img className='tips__images' src={edit} alt='edit'/>
                                        <p>
                                          This is the edit button and it'll appear when your viewing a map that you own and is saved onto the database. This allows us to save the current changes made to the map.
                                        </p>
                                </div>

                                <div className='tips__line'></div>

                                <div className='tips__flex'>
                                        <img className='tips__images' src={delete_icon} alt='delete'/>
                                        <p>
                                          This button will delete current map. Once a map has been deleted it may seem like it's still there, that's a fragment and if we accidentally delete a map a fragment is created
                                          in which the user can resave that fragment, edit it, or just ignore it and the map will completely be gone, it's a neat feature!
                                        </p>
                                </div>

                        </div>
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

                    <li className="tips__navigation-item">
                      <a href="#tip6"
                        className="tips__navigation-button 6" ref={button6}
                        onClick={navigateSlider}
                        ></a>
                    </li>

                    <li className="tips__navigation-item">
                      <a href="#tip7"
                        className="tips__navigation-button 7" ref={button7}
                        onClick={navigateSlider}
                        ></a>
                    </li>

                    <li className="tips__navigation-item">
                      <a href="#tip8"
                        className="tips__navigation-button 8" ref={button8}
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
