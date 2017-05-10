import React from 'react';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

class Photo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photoList: photoStore.getList(),
      currentPhoto: []
    }
  }

  componentDidMount() {
    if (this.state.photoList.length > 0) {
    this.setState({
      currentPhoto: this.state.photoList[0][this.props.params.type]
    })
    }
  }

  handleAddItem(newItem) {
    photoActions.addItem(newItem);
  }

  handleClick(photoItem){
    this.handleAddItem(photoItem);
    this.setState({
      photoList: photoStore.getList()
    })
  }

  _onChange() {
    this.setState({
      photoList: photoStore.getList()
    })
  }

  render() {

    return (
      <div className="photo">
        <h1>Photo</h1>
        <Card>
          <CardHeader title="URL Avatar" subtitle="Subtitle" avatar="http://www.hdwallpapers.in/walls/neytiri_in_avatar_2-wide.jpg" />
          <CardMedia overlay={<CardTitle title="Liege Waffles" subtitle="Overlay subtitle" />} >
          <img src={this.state.currentPhoto.img} className="foodImg"/>
          </CardMedia>
          <CardTitle title={this.state.currentPhoto.title} subtitle={this.state.currentPhoto.description} />
          <CardText>
            {this.state.currentPhoto.description}
          </CardText>
          <CardActions>
            <RaisedButton label="GET MORE INFO" primary={true} fullWidth={true}/>
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default Photo;
