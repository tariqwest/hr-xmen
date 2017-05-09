import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

function Photo() {
  return (
    <div className="photo">
      <h1>Photo</h1>
      <Card>
        <CardHeader title="URL Avatar" subtitle="Subtitle" avatar="http://www.hdwallpapers.in/walls/neytiri_in_avatar_2-wide.jpg" />
        <CardMedia overlay={<CardTitle title="Liege Waffles" subtitle="Overlay subtitle" />} >
        <img src="http://cdn-image.foodandwine.com/sites/default/files/201111-xl-liege-waffles.jpg" className="foodImg"/>
        </CardMedia>
        <CardTitle title="Liege Waffles" subtitle="Card subtitle" />
        <CardText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <RaisedButton label="GET MORE INFO" primary={true} fullWidth={true} />
        </CardActions>
      </Card>
    </div>
  )
}

export default Photo;
