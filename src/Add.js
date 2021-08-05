import React, {useState} from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import firebase from './firebase/firebase';
import 'react-html5-camera-photo/build/css/index.css';
import 'firebase/storage';

const storage = firebase.storage();

export const Add = ({ count, setCount, album, setCurrentView }) => {

  const [dataUri, setDataUri] = useState('');
  let classNameFullscreen = 'demo-image-preview-fullscreen';

  const handleCameraError = (error) => {
    console.log('handleCameraError', error);
  };

  const handleCancel = () => {
    setDataUri('');
  };

  const handleAnimationDone = (dataUri) => {
    setDataUri(dataUri);
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(',')[1]);
  
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], {type: mimeString});
    return blob;
  }
  
  const padWithZeroNumber = (number, width) => {
    number = number + '';
    return number.length >= width
      ? number
      : new Array(width - number.length + 1).join('0') + number;
  }
  
  const getFileExtention = (blobType) => {
    let extention = IMAGE_TYPES.PNG;
  
    if (blobType === 'image/jpeg') {
      extention = IMAGE_TYPES.JPG;
    }
    return extention;
  };
  
  const getFileName = (imageNumber, blobType) => {
    const prefix = 'photo';
    const photoNumber = padWithZeroNumber(imageNumber, 4);
    const extention = getFileExtention(blobType);
  
    return `${prefix}-${photoNumber}.${extention}`;
  }
  
  // const downloadImageFileFomBlob = (blob, imageNumber) => {
  //   window.URL = window.webkitURL || window.URL;
  
  //   let anchor = document.createElement('a');
  //   anchor.download = getFileName(imageNumber, blob.type);
  //   anchor.href = window.URL.createObjectURL(blob);
  //   let mouseEvent = document.createEvent('MouseEvents');
  //   mouseEvent.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
  //   anchor.dispatchEvent(mouseEvent);
  // }


  const sendImage = () => {
    let blob = dataURItoBlob(dataUri);
    const file = getFileName(count, blob.type);
    const storageRef = storage.ref();
    const uploadTask = storageRef.child(album + '/' + file).put(blob);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>{
        console.log( Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100 );
      },(error) =>{
        throw error
      },() =>{
        uploadTask.snapshot.ref.getDownloadURL().then(() =>{
          setCount(count++);
          setCurrentView('show');
        })
      }
    ) 
  };

  return (
    <div className="camera">
    {
      (dataUri) ? (
        <div className="preview">
          <div className={'demo-image-preview ' + classNameFullscreen}>
            <img alt="your portrait, mate" src={dataUri} />
          </div>
          <div className="review">
            <button className="primary-button" onClick={sendImage}>Looks good.</button>
            <button className="primary-button" onClick={handleCancel}>Retake!</button>
          </div>
        </div>
      ) : (
        <Camera
          isFullscreen={false}
          onTakePhotoAnimationDone = { handleAnimationDone }
          onCameraError = { (error) => { handleCameraError(error); } }
          idealFacingMode = {FACING_MODES.USER}
          idealResolution = {{width: 1536, height: 2048}}
          imageType = {IMAGE_TYPES.JPG}
          album = {album}
          imageCompression = {0.97}
          isMaxResolution = {false}
          isImageMirror = {false}
          isSilentMode = {false}
          isDisplayStartCameraError = {true}
          sizeFactor = {1}
        />
      )
    }
    </div>
  );
};

export default Add;