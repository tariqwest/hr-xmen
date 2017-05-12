import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';
import defaultData from '../../default.js'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

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
        <Paper zDepth={4} rounded={true}>
          <Card>
            <CardHeader title="URL Avatar" subtitle="Subtitle" avatar="http://www.hdwallpapers.in/walls/neytiri_in_avatar_2-wide.jpg" />
            <CardMedia overlay={<CardTitle title={this.state.current.title || defaultData.currentDefault.title} />} >
            <img src={this.state.current.img || defaultData.currentDefault.img}/>
            </CardMedia>
            <CardTitle title={this.state.current.title || defaultData.currentDefault.title} />
            <CardText>
            {this.state.current.description || defaultData.currentDefault.description}
            </CardText>
            <CardActions>
              <Link to="/app/photos/photoinfo">
                <RaisedButton label="GET MORE INFO" primary={true} fullWidth={true}/>
              </Link>
            </CardActions>
          </Card>
        </Paper>
      </div>
    )
  }
}

export default Photo;
