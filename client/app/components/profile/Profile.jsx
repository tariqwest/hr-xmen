import React from 'react';
import ReactDOM from 'react-dom';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios';

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
    height: 200,
    width: 200,
    margin: 20,
    textAlign: 'center',
  },
  anchor: {
    textDecoration: 'none'
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
      current: photoStore.getCurrent()
    }
  }

  render() {
    return (
      <div className="container profile">
        <h1>Profile</h1>
        <div className="banner">
            <Paper style={styles.paper} zDepth={4} circle={true}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Fried-Chicken-Leg.jpg" height="200" width="200" />
            </Paper>
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
                    <div className="flex-container">
                      <List>
                        <h1>Favorites</h1>
                        {response.data.restaurants.map((restaurant, index) => (

                        <ListItem
                          className="flex"
                          style={styles.divider}
                          key={index}
                          rightIconButton={
                            <IconMenu iconButtonElement={iconButtonElement}>
                              <a href={restaurant.url} target="_blank" style={styles.anchor}><MenuItem>Learn More</MenuItem></a>
                              <MenuItem>Favorite</MenuItem>
                            </IconMenu>
                          }
                          leftAvatar={<Avatar src={restaurant.image_url} />}
                          primaryText={restaurant.name}
                          secondaryText={
                            <p>
                              <span style={{color: darkBlack}}>{restaurant.rating} -- {restaurant.categories}</span>
                                <br/> {restaurant.location}
                            </p>
                          }
                          secondaryTextLines={2}
                        />
                        ))}
                      </List>
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
