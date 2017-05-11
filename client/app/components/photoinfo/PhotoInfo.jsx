import React from 'react';
import axios from 'axios';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';
import defaultData from '../../default.js';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
// import MobileTearSheet from '../../../MobileTearSheet';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

const yelpData = [{
  image_url: 'http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg',
  review_count: '151 reviews',
  rating: '4 stars',
  url: 'https://www.yelp.com/biz/everest-indian-restaurant-petaluma?osq=Himalayan',
  name: 'Everest Indian Restaurant',
  location: 'Petaluma, CA',
  categories: 'Himalayan'
},
{
  image_url: 'http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg',
  review_count: '151 reviews',
  rating: '4 stars',
  url: 'https://www.yelp.com/biz/everest-indian-restaurant-petaluma?osq=Himalayan',
  name: 'Everest Indian Restaurant',
  location: 'Petaluma, CA',
  categories: 'Himalayan'
},
{
  image_url: 'http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg',
  review_count: '151 reviews',
  rating: '4 stars',
  url: 'https://www.yelp.com/biz/everest-indian-restaurant-petaluma?osq=Himalayan',
  name: 'Everest Indian Restaurant',
  location: 'Petaluma, CA',
  categories: 'Himalayan'
},
{
  image_url: 'http://s.eatthis-cdn.com/media/images/ext/842849976/greasy-fast-food.jpg',
  review_count: '151 reviews',
  rating: '4 stars',
  url: 'https://www.yelp.com/biz/everest-indian-restaurant-petaluma?osq=Himalayan',
  name: 'Everest Indian Restaurant',
  location: 'Petaluma, CA',
  categories: 'Himalayan'
}]

const yummplyData = [{
  name: 'Pizza',
  description: 'description',
  instructions: 'instructions',
  prepTime: '2 hours',
  ingredients: 'ingredients',
  rating: '5 stars',
  url: 'http://www.foodnetwork.com/recipes/alton-brown/pizza-pizzas-recipe4'
},
{
  name: 'Pizza',
  description: 'description',
  instructions: 'instructions',
  prepTime: '2 hours',
  ingredients: 'ingredients',
  rating: '5 stars',
  url: 'http://www.foodnetwork.com/recipes/alton-brown/pizza-pizzas-recipe4'
},
{
  name: 'Pizza',
  description: 'description',
  instructions: 'instructions',
  prepTime: '2 hours',
  ingredients: 'ingredients',
  rating: '5 stars',
  url: 'http://www.foodnetwork.com/recipes/alton-brown/pizza-pizzas-recipe4'
},
{
  name: 'Pizza',
  description: 'description',
  instructions: 'instructions',
  prepTime: '2 hours',
  ingredients: 'ingredients',
  rating: '5 stars',
  url: 'http://www.foodnetwork.com/recipes/alton-brown/pizza-pizzas-recipe4'
}]

const styles = {
  divider: {
    'borderBottom': '1px solid rgba(140,139,139, 0.2)'
  }
};

class PhotoInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: photoStore.getList(),
      current: photoStore.getCurrent()
    }
  }

  render() {
    const axiosInstance = axios.create({
      data: {
        photoURL: this.state.current.img || defaultData.currentDefault.img,
        location: {
          lat: 37.773972,
          lng: -122.431297
        }
      }
    });
    return (
      <div className="photoinfo">
        <h1>PhotoInfo</h1>
        <Card>
          <CardMedia overlay={<CardTitle title={this.state.current.title || defaultData.currentDefault.title} />} >
          <img src={this.state.current.img || defaultData.currentDefault.img} className="foodImg"/>
          </CardMedia>
          <CardTitle title={this.state.current.title || defaultData.currentDefault.title} />
          <CardText>
          {this.state.current.description || defaultData.currentDefault.description}
          </CardText>
          <CardActions>
          </CardActions>
        </Card>
        <Post url="http://127.0.0.1:8080/photos/photo-process-test" instance={axiosInstance}>
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
                  <List className="flex">
                    <Subheader>Restaurants</Subheader>
                    {response.data.restaurants.map((restaurant, index) => (
                    <a href={restaurant.url} target="_blank" key={index}>
                    <ListItem
                      style={styles.divider}
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
                    </a>
                    ))}
                  </List>
                  <List className="flex">
                    <Subheader>Recipes</Subheader>
                    {response.data.recipes.map((recipe, index) => (
                    <a href={recipe.url} target="_blank" key={index}>
                    <ListItem
                      style={styles.divider}
                      primaryText={recipe.name}
                      secondaryText={
                        <p>
                          <span style={{color: darkBlack}}>{recipe.rating} -- {recipe.description}</span>
                            <br/> {recipe.prepTime}
                        </p>
                      }
                      secondaryTextLines={2}
                    />
                    </a>
                    ))}
                  </List>
                </div>
              )
            }
            return (<div>Default message before request is made.</div>)
          }}
        </Post>
    </div>
    )
  }
}

export default PhotoInfo;
