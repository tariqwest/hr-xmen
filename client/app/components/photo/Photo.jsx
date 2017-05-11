import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class Photo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: photoStore.getList(),
      current: photoStore.getCurrent()
    }
  }

  render() {
    return (
      <div className="photo">
        <h1>Photo</h1>
        <Card>
          <CardHeader title="URL Avatar" subtitle="Subtitle" avatar="http://www.hdwallpapers.in/walls/neytiri_in_avatar_2-wide.jpg" />
          <CardMedia overlay={<CardTitle title={this.state.current.title} />} >
          <img src={this.state.current.img} className="foodImg"/>
          </CardMedia>
          <CardTitle title={this.state.current.title} />
          <CardText>
          {this.state.current.description}
          </CardText>
          <CardActions>
            <Link to="/photos/photoinfo">
              <RaisedButton label="GET MORE INFO" primary={true} fullWidth={true}/>
            </Link>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default Photo;
