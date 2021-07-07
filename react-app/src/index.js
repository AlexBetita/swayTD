import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import { ModalProvider } from './context/Modal';
import App from './App';
import configureStore from './store';

import './index.css';

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ModalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
