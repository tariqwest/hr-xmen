import React from 'react';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';
import defaultData from '../../default.js'

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
    'border-bottom': '1px solid rgba(140,139,139, 0.2)'
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
        <div className="flex-container">
          <List className="flex">
            <Subheader>Restaurants</Subheader>
            {yelpData.map((restaurant, index) => (
            <a href={restaurant.url} target="_blank">
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
            {yummplyData.map((recipe, index) => (
            <a href={recipe.url} target="_blank">
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
    </div>
    )
  }
}

export default PhotoInfo;
