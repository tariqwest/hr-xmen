import React from 'react';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

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
          <CardHeader title="URL Avatar" subtitle="Subtitle" avatar="http://www.hdwallpapers.in/walls/neytiri_in_avatar_2-wide.jpg" />
          <CardMedia overlay={<CardTitle title={this.state.current.title} />} >
          <img src={this.state.current.img} className="foodImg"/>
          </CardMedia>
          <CardTitle title={this.state.current.title} />
          <CardText>
          {this.state.current.description}
          </CardText>
          <CardActions>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default PhotoInfo;
