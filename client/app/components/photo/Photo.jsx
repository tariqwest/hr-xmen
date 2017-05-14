import React from 'react';
import { Link } from 'react-router';
import _ from 'underscore';

import photoStore from '../../stores/photoStore';
import defaultData from '../../default.js';

import Paper from 'material-ui/Paper';

const styles = {
  paper: {
    maxWidth: '90%',
    height: 'auto',
    margin: 20,
    textAlign: 'center',
  },
  anchor: {
    textDecoration: 'none',
    fontSize: '.8em',
  },
};

class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: photoStore.getList(),
      current: photoStore.getCurrent(),
    };
  }

  render() {
    const colorClass = ['item--blue', 'item--green', 'item--darkblue', 'item--red', 'item--orange', 'item--pink'];
    return (
      <div className="photo">
        <h1>Photo</h1>
        <Paper style={styles.paper} zDepth={4} >
          <div className={colorClass[_.random(5)]}>
            <div className="item_inner">
              <img src={this.state.current.img || defaultData.currentDefault.img} className="z-depth-4" width="70%" alt="food" />
              <h1>{this.state.current.title || defaultData.currentDefault.title}</h1>
              <p>{this.state.current.description || defaultData.currentDefault.description}</p>
              <Link to="/app/photos/photoinfo">
                <a className="button" target="_blank" style={styles.anchor}>GET MORE INFO</a>
              </Link>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default Photo;
