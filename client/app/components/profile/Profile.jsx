import React from 'react';
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import CircularProgress from 'material-ui/CircularProgress';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'rgb(0, 188, 212)',
  },
};

function Profile() {
  return (
    <div className="container profile">
      <h1>Profile</h1>
      <h1 className="favoriteTitle">Favorites: </h1>
          <Get url="http://127.0.0.1:8080/api/photos/profile">
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
                 <div style={styles.root}>
                    <GridList style={styles.gridList} cols={2.2}>
                      {response.data.map((tile) => (
                        <GridTile
                          key={tile.img}
                          title={tile.title}
                          actionIcon={<IconButton><StarBorder color="rgb(0, 188, 212)" /></IconButton>}
                          titleStyle={styles.titleStyle}
                          titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                        >
                          <img src={tile.img} />
                        </GridTile>
                      ))}
                    </GridList>
                  </div>
                )
              }
              return (<div>Default message before request is made.</div>)
            }}
          </Get>
    </div>
  )
}

export default Profile;
