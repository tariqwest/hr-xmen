import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

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

const tilesData = [
  {
    img: 'http://cdn-image.foodandwine.com/sites/default/files/201111-xl-liege-waffles.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'https://static1.squarespace.com/static/50a43af2e4b013b04b877d4e/50a48341e4b06eecde88101c/50c183d0e4b08bba8489d091/1434199989721/_MG_9865.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'https://www.sweetashoney.co/wp-content/uploads/DSC_0081.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'http://1.bp.blogspot.com/-Zg0XbmBG-NI/VCnq3KYS5RI/AAAAAAAAG1s/ri7467hdlKA/s1600/waffle%2Bcover%2BREVISED.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'http://www.europeancuisines.com/sites/default/files/Liege_Waffles_Plated_Up.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'https://2.bp.blogspot.com/-gvWAv7FO6wI/Vthl0_-QzUI/AAAAAAAAQ8U/CT20sQq_zJc/s1600/DSC_5768.JPG',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'https://foodydoody.files.wordpress.com/2015/09/dsc_5130.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
  {
    img: 'http://4.bp.blogspot.com/-Yz0eHsyFtLI/VP5dcZrAMyI/AAAAAAAAPLk/-s2uDvuVlEo/s1600/Caramelized%2BWaffles%2B(Liege%2BWaffles)%2B2.jpg',
    title: 'Liege Waffles',
    description: 'description',
  },
];

function Profile() {
  return (
<div className="container profile">
  <h1>Profile</h1>
  <h1 className="favoriteTitle">Favorites: </h1>
  <div style={styles.root}>
    <GridList style={styles.gridList} cols={2.2}>
      {tilesData.map((tile) => (
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
</div>

  )
}

export default Profile;
