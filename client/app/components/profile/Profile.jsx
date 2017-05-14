import React from 'react';
import { Get } from 'react-axios';
import _ from 'underscore';

import photoStore from '../../stores/photoStore';

import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
  paper: {
    maxWidth: '15em',
    height: 'auto',
    margin: 20,
    textAlign: 'center',
  },
  anchor: {
    textDecoration: 'none',
    fontSize: '.8em',
  },
};

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: photoStore.getList(),
      current: photoStore.getCurrent(),
      colorCount: 0,
    };
  }


  render() {
    const colorClass = ['item--blue', 'item--green', 'item--darkblue', 'item--red', 'item--orange', 'item--pink'];
    return (
      <div className="container profile">
        <h1>Profile/USERNAME</h1>
        <Get url={process.env.NODE_ENV === 'production' ? `${process.env.ENV_URL}/api/photos/profile` : `${process.env.ENV_URL}:${process.env.PORT}/api/photos/profile`} >
          {(error, response, isLoading) => {
            if (error) {
              return (<div>Something bad happened: {error.message}</div>);
            } else if (isLoading) {
              return (
                <div>
                  <CircularProgress size={80} thickness={5} />
                </div>
              );
            } else if (response !== null) {
              return (
                <div>
                  <h2>Favorites</h2>
                  <div className="row">
                    {response.data.map((item, index) => (
                      <Paper style={styles.paper} zDepth={4} key={index}>
                        <div className={colorClass[_.random(5)]} key={index}>
                          <div className="item_inner">
                            <img src={item.photoURL} width="250" className="z-depth-3" alt="food" />
                            <p>{item.savedItem.name}</p>
                            <p>{item.savedItem.rating} Stars</p>
                            <p>{item.savedItem.location || item.savedItem.prepTime}</p>
                            <a href={item.savedItem.url} className="button" target="_blank" style={styles.anchor}>Learn More</a>
                          </div>
                        </div>
                      </Paper>
                    ))}
                  </div>
                </div>
              );
            }
            return (<div>Default message before request is made.</div>);
          }}
        </Get>
      </div>
    );
  }
}

export default Profile;
