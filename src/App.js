import React, { useState, useEffect, useRef} from 'react';
import 'react-html5-camera-photo/build/css/index.css';
import './app.sass';
import Add from './Add';
import firebase from './firebase/firebase';

const App = (props) => {
  const [dataUri, setDataUri] = useState('');
  const [imageNumber, setImageNumber] = useState(0);
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [count, setCount] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const [cameraStatus, setCameraStatus] = useState(false);
  const imagesData = useRef(null);
  const intervalIdData = useRef(null);
  const cameraStatusData = useRef(false);

  useEffect(() => {
    const prevImagesData = imagesData.current;
    const prevIntervalIdData = intervalIdData.current;
    const prevCameraStatusData = cameraStatusData.current;
    if (images !== prevImagesData) {
      imagesData.current = images;
    }
    if (intervalIdData !== prevIntervalIdData) {
      intervalIdData.current = intervalId;
    }
    if (cameraStatusData !== prevCameraStatusData) {
      cameraStatusData.current = cameraStatus;
    }
  },[images, imagesData, intervalId, intervalIdData, cameraStatus, cameraStatusData]);

  const handleAddPhoto = () => {
    setStep(1);
    clearInterval(intervalIdData.current);
  }

  const animation = (countImages) => {
    let imageNum = 0;
    const flip = setInterval(() => {
      if (imageNum < (countImages)) {
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

  useEffect(() => {
    const fetchImages = async (folder) => {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const listRef = storageRef.child(folder);
      await listRef.listAll().then(result => {
        let promises = result.items.map((imageItem) => {
          return imageItem.getDownloadURL();
        });
        Promise.all(promises).then(urls => {
          setImages(urls);
          setCount(urls.length);
          setImageNumber(urls.length);
          animation(urls.length);
        });
      });
    }
    fetchImages('folder/');
  }, [count])

  const isFullscreen = true;

  return (
    <div className={`app step-${step}`}>
      <div className="flip">
        <div className="addbutton">
          <button onClick={handleAddPhoto}>Add your photo</button>
        </div>
        <div className="frames">
          {images.map((image, index) => {
            return (<div key={`image-${index}`} className={currentImage === index ? "frame active" : "frame"}><img alt="portrait" className="frameImage" src={image} /></div>);
          })}
        </div>
      </div>
      <div className="camera">
          {
            (step === 1) ? (
              <Add
              dataUri={dataUri}
              setDataUri={setDataUri}
              setStep={setStep}
              setCount={setCount}
              imageNumber={imageNumber}
              isFullscreen={isFullscreen}
              setCameraStatus={setCameraStatus}
            />
            ) : null
          }
      </div>
    </div>
  );
}

export default App;
