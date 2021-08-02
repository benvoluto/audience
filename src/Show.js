import React, { useState, useEffect, useRef} from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import './app.sass';
import firebase from './firebase/firebase';
import 'firebase/storage';

const storage = firebase.storage();

const Show = ({album, count, setCount}) => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const imagesData = useRef(null);
  const intervalIdData = useRef(null);

  useEffect(() => {
    const prevImagesData = imagesData.current;
    const prevIntervalIdData = intervalIdData.current;
    if (images !== prevImagesData) {
      imagesData.current = images;
    }
    if (intervalIdData !== prevIntervalIdData) {
      intervalIdData.current = intervalId;
    }
    return false;
  },[images, imagesData, intervalId, intervalIdData]);

  useEffect(() => {
    let isSubscribed = true;
    const animation = () => {
      let imageNum = 0;
      const flip = setInterval(() => {
        if (imageNum < (count - 1)) {
          imageNum++;
          setCurrentImage(imageNum);
        } else {
          setCurrentImage(0);
          imageNum = 0;
        }
      }, 1600);
      clearInterval(intervalIdData.current);
      clearInterval(intervalId);
      setIntervalId(flip);
    };

    const FetchImages = async () => {
      const storageRef = storage.ref();
      const listRef = storageRef.child(album);
      await listRef.listAll().then(result => {
        if (isSubscribed) {
          let promises = result.items.map((imageItem) => {
            return imageItem.getDownloadURL();
          });
          Promise.all(promises).then(urls => {
            if (urls.length < 1) return false;
            setImages(urls);
            setCount(urls.length);
            animation(urls.length);
          });
        }
      });
    }
    FetchImages();
    return () => isSubscribed = false;
  }, [count]);

  return (
    <div className="show">
        <div className="flip">
          <div className="frames">
            {images.map((image, index) => {
              return (
                <div key={`image-${index}`} className={currentImage === index ? "frame active" : "frame"}>
                  <img alt="portrait" className="frameImage" src={image} />
                </div>);
            })}
          </div>
        </div>
    </div>
  );
}

export default Show;
