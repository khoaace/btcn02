import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// Axios calls API
import axios from 'axios';
// Infinite Scroller
import InfiniteScroll from 'react-infinite-scroller';
//Grid gallery
import Gallery from 'react-grid-gallery';
import Navbar from './components/navbar.jsx';

class App extends Component {
  state = {
    urlAPI: `https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=71bb3dc2fc4e572f5613d03922bf5d44&extras=url_s%2Curl_l%2Cowner_name%2Cviews&per_page=20&page=0&format=json&nojsoncallback=1`,
    photos: [],
    currentPage: 0,
  };
  nextPage = async () => {
    let currentPage = this.state.currentPage;
    console.log(this.state.currentPage);
    let photos;
    //Handle
    const newUrlAPI = this.state.urlAPI.replace(
      '&page=' + currentPage,
      '&page=' + parseInt(currentPage + 1, 10)
    );
    console.log(newUrlAPI);
    await axios.get(newUrlAPI).then(res => {
      photos = res.data.photos.photo.map((photo, index) => {
        const width = parseInt(photo.width_s, 10);
        const height = parseInt(photo.height_s, 10);
        return {
          src: photo.url_l,
          thumbnail: photo.url_s,
          thumbnailWidth: width,
          thumbnailHeight: height,
          caption: photo.title,
          info: { owner: photo.ownername, views: photo.views },
        };
      });
    });
    await this.setState({
      urlAPI: newUrlAPI,
      currentPage: currentPage + 1,
      photos: this.state.photos.concat(photos),
    });
  };

  setCustomTags(i) {
    return i.tags.map(t => {
      return (
        <div key={t.value} style={customTagStyle}>
          {t.title}
        </div>
      );
    });
  }

  render() {
    var photos = this.state.photos.map(i => {
      i.customOverlay = (
        <div style={captionStyle}>
          <div>Title : {i.caption}</div>
          Owner : {i.info.owner}
          <br />
          Views : {i.info.views}
          {i.hasOwnProperty('tags') && this.setCustomTags(i)}
        </div>
      );
      return i;
    });
    return (
      <div className="App">
        <Navbar />
        <InfiniteScroll
          pageStart={0}
          loadMore={this.nextPage}
          hasMore={true || false}
          loader={
            <div className="loader" key={0}>
              <img
                src="https://cdn.dribbble.com/users/359314/screenshots/2379673/untitled-3.gif"
                style={{ width: '300px', height: '200px' }}
              />
            </div>
          }
        >
          <div
            style={{
              display: 'block',
              minHeight: '1px',
              width: '100%',
              border: '1px solid #ddd',
            }}
          >
            <Gallery images={photos} enableImageSelection={false} />
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

//Style
const captionStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  maxHeight: '240px',
  overflow: 'hidden',
  position: 'absolute',
  bottom: '0',
  width: '100%',
  color: 'white',
  padding: '2px',
  fontSize: '90%',
};

const customTagStyle = {
  wordWrap: 'break-word',
  display: 'inline-block',
  backgroundColor: 'white',
  height: 'auto',
  fontSize: '75%',
  fontWeight: '600',
  lineHeight: '1',
  padding: '.2em .6em .3em',
  borderRadius: '.25em',
  color: 'black',
  verticalAlign: 'baseline',
  margin: '2px',
};
export default App;
