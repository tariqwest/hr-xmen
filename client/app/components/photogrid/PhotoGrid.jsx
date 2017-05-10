import React from 'react';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios'
import { Link } from 'react-router';

import photoStore from '../../stores/photoStore';
import photoActions from '../../actions/photoActions';

import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CircularProgress from 'material-ui/CircularProgress';
import TouchRipple from 'material-ui/internal/TouchRipple'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1000,
    height: 850,
    overflowY: 'auto',
  }
};

class PhotoGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      photoList: photoStore.getList()
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
    return(
      <div className="container photogrid">
        <h1>Photo Grid</h1>
          <div>
            <Get url="http://127.0.0.1:8080/photos">
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
                    <div className="container photogrid">
                      <div style={styles.root}>
                        <GridList cellHeight={280} cols={3} style={styles.gridList}>
                          <Subheader>Food</Subheader>
                          {response.data.map((tile, index) => (
                          <Link
                          to={'/photo/' + index}
                          className="ripple"
                          onClick={this.handleClick.bind(this, response.data)}
                          key={tile.img}>
                          <GridTile
                            className="ripple"
                            title={tile.title}
                            subtitle={<span><b>{tile.description}</b></span>}
                            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                            >
                          <img src={tile.img} />
                          </GridTile>
                          </Link>
                          ))}
                        </GridList>
                      </div>
                    </div>
                    )
                }
                return (<div>Default message before request is made.</div>)
              }}
            </Get>
          </div>
      </div>
    )
  }
}

export default PhotoGrid;
