import React from 'react';
import axios from 'axios';
import { Post } from 'react-axios';

import photoStore from '../../stores/photoStore';
import defaultData from '../../default.js';

import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { grey400, darkBlack } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';

const styles = {
  divider: {
    borderBottom: '1px solid rgba(140,139,139, 0.2)',
  },
  paper: {
    height: 200,
    width: 200,
    margin: 20,
    textAlign: 'center',
  },
  anchor: {
    textDecoration: 'none',
  },
};

const iconButtonElement = (
  <IconButton
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

class PhotoInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: photoStore.getList(),
      current: photoStore.getCurrent(),
      location: photoStore.getLocation(),
    };
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(recipeORRestaurant, imgURL) {
    axios.post(process.env.NODE_ENV === 'production' ? `${process.env.ENV_URL}/api/photos/photo-save` : `${process.env.ENV_URL}:${process.env.PORT}/api/photos/photo-save`, {
      recipeORRestaurant,
      imgURL,
    })
    .catch(err => {
      throw err;
    });
  }

  render() {
    const axiosInstance = axios.create({
      data: {
        photoURL: this.state.current.img || defaultData.currentDefault.img,
        location: { lat: this.state.location.latitude, lng: this.state.location.longitude },
      },
    });
    return (
      <div className="photoinfo">
        <div className="banner">
          <Paper style={styles.paper} zDepth={4}>
            <img src={this.state.current.img || defaultData.currentDefault.img} height="200" width="200" alt="food" />
          </Paper>
          <div className="bannerinfo">
            <h1>{this.state.current.title || defaultData.currentDefault.title}</h1>
            <h4>{this.state.current.description || defaultData.currentDefault.description}</h4>
          </div>
        </div>
        <Post url={process.env.NODE_ENV === 'production' ? `${process.env.ENV_URL}/api/photos/photo-process` : `${process.env.ENV_URL}:${process.env.PORT}/api/photos/photo-process`} instance={axiosInstance}>
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
                    <div className="flex-container">
                      <List className="flex">
                        <h1>Restaurants</h1>
                        {response.data.restaurants.map((restaurant, index) => (
                          <ListItem
                            style={styles.divider}
                            key={index}
                            rightIconButton={
                              <IconMenu iconButtonElement={iconButtonElement}>
                                <a href={restaurant.url} target="_blank" style={styles.anchor}><MenuItem>Learn More</MenuItem></a>
                                <MenuItem onClick={() => this.handleSave(restaurant, this.state.current.img || defaultData.currentDefault.img)}>Favorite</MenuItem>
                              </IconMenu>
                            }
                            leftAvatar={<Avatar src={restaurant.image_url} />}
                            primaryText={restaurant.name}
                            secondaryText={
                              <p>
                                <span style={{ color: darkBlack }}>{restaurant.rating} -- {restaurant.categories[0].title}</span>
                                <br /> {restaurant.location}
                              </p>
                            }
                            secondaryTextLines={2}
                          />
                        ))}
                      </List>
                      <List className="flex">
                        <h1>Recipes</h1>
                        {response.data.recipes.map((recipe, index) => (
                          <ListItem
                            style={styles.divider}
                            key={index}
                            rightIconButton={
                              <IconMenu iconButtonElement={iconButtonElement}>
                                <a href={recipe.url} target="_blank" style={styles.anchor}><MenuItem>Learn More</MenuItem></a>
                                <MenuItem onClick={() => this.handleSave(recipe, this.state.current.img || defaultData.currentDefault.img)}>Favorite</MenuItem>
                              </IconMenu>
                            }
                            primaryText={recipe.name}
                            secondaryText={
                              <p>
                                <span style={{ color: darkBlack }}>{recipe.rating} -- ingredients</span>
                                <br /> {recipe.prepTime}
                              </p>
                            }
                            secondaryTextLines={2}
                          />
                        ))}
                      </List>
                    </div>
                  );
                }
                return (<div>Default message before request is made.</div>);
              }}
        </Post>
      </div>
    );
  }
}

export default PhotoInfo;
