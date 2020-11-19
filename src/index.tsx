import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/bootstrap.css';
import { Provider } from 'react-redux';

import store from './features/store';

import App from './views/App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);