import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import PhotoGrid from './components/photogrid/PhotoGrid';
import Photo from './components/photo/Photo';
import Profile from './components/profile/Profile';

import reducers from './reducers';

import './components/bundle.scss';

const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={PhotoGrid} />;
        <Route path="/photo" component={Photo} />
        <Route path="/profile" component={Profile} />
      </Route>
    </Router>
  </Provider>
  , document.getElementById('react-root'));
