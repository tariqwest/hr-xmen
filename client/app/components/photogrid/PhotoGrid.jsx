import React from 'react';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios'
import RaisedButton from 'material-ui/RaisedButton';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

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
  },
};

class PhotoGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
                  return (<div>Loading...</div>)
                }
                else if(response !== null) {
                  return (
                    <div className="container photogrid">
                      <div style={styles.root}>
                        <GridList cellHeight={280} cols={3} style={styles.gridList}>
                          <Subheader>Food</Subheader>
                          {response.data.map((tile) => (
                          <GridTile
                            key={tile.img}
                            title={tile.title}
                            subtitle={<span><b>{tile.description}</b></span>}
                            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                            >
                          <img src={tile.img} />
                          </GridTile>
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
