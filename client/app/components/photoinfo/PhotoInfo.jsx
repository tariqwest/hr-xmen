import React from 'react';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';

class PhotoInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photoList: photoStore.getList(),
      currentPhoto: photoStore.getCurrent()
    }
  }

  render() {
    return (
      <div className="photoinfo">
        <h1>PhotoInfo</h1>
        <p>something: {this.state.currentPhoto.img}</p>
      </div>
    )
  }
}

export default PhotoInfo;
