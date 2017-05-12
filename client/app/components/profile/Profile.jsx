import React from 'react';
import ReactDOM from 'react-dom';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios';
import _ from 'underscore';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';
import defaultData from '../../default.js'

import {GridList, GridTile} from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
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
    height: '100%',
    width: '100%',
    margin: 20,
    textAlign: 'center',
  },
  anchor: {
    textDecoration: 'none',
    fontSize: '.8em'
  }
};

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

class Profile extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      list: photoStore.getList(),
      current: photoStore.getCurrent(),
      colorCount: 0
    }
  }


  render() {

    const colorClass = ['item--blue', 'item--green', 'item--darkblue', 'item--red', 'item--orange', 'item--pink'];

    return (
      <div className="container profile">
        <h1>Profile</h1>
        <div className="banner">
            <div className="bannerinfo">
              <h1>USERNAME</h1>
            </div>
          </div>

            <Get url={`${process.env.ENV_URL}:${process.env.PORT}/api/photos/profile`}>
              {(error, response, isLoading) => {
                if(error) {
                  return (<div>Something bad happened: {error.message}</div>)
                }
                else if(isLoading) {
                  return (
                    <div>
                      <CircularProgress size={80} thickness={5} />
                    </div>
                  )
                }
                else if(response !== null) {
                  return (
                      <div>
                      <h1>Favorites</h1>
                      <div className='row'>
                        {response.data.restaurants.map((restaurant, index) => (
                        <div className={colorClass[_.random(5)]} key={index}>
                          <div className='item_inner'>
                            <img src={restaurant.image_url} width='250'/>
                            <p>{restaurant.name}</p>
                            <p>{restaurant.location}</p>
                            <p>{restaurant.rating}</p>
                            <p>{restaurant.categories}</p>
                            <a href={restaurant.url} className='button' target='_blank' style={styles.anchor}>Learn More</a>
                          </div>
                        </div>
                        ))}
                      </div>
                      </div>
                  )
                }
                return (<div>Default message before request is made.</div>)
              }}
            </Get>
      </div>
    )
  }
}

export default Profile;
