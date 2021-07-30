import React from 'react';
import PropTypes from 'prop-types';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import firebase from './firebase/firebase';
import './index.css';
import 'react-html5-camera-photo/build/css/index.css';

export const Add = ({ dataUri, isFullscreen, imageNumber, setDataUri, setStep, setCount, setCameraStatus}) => {
  let classNameFullscreen = isFullscreen ? 'demo-image-preview-fullscreen' : '';

  const handleCameraError = (error) => {
    console.log('handleCameraError', error);
  }

  const handleCameraStart = () => {
    setCameraStatus(true);
  }

  const handleCancel = () => {
    console.log("cancel")
    setDataUri(null);
  }

  const handleAnimationDone = (dataUri) => {
    setCameraStatus(false);
    setDataUri(dataUri);
  }

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
  }
  
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


  const downloadImageFile = () => {
    let blob = dataURItoBlob(dataUri);
    const file = getFileName(imageNumber, blob.type);
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const uploadTask = storageRef.child('folder/' + file).put(blob);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>{
        console.log( Math.round((snapshot.bytesTransferred/snapshot.totalBytes))*100 );
      },(error) =>{
        throw error
      },() =>{
        uploadTask.snapshot.ref.getDownloadURL().then(() =>{
          setDataUri('');
          setStep(0);
          setCount(0);
        })
    }
  ) 
  }

  return (
    <div>
    {
      (dataUri) ? (
        <div className="preview">
          <div className={'demo-image-preview ' + classNameFullscreen}>
            <img alt="your portrait, mate" src={dataUri} />
          </div>
          <button onClick={downloadImageFile}>Looks good.</button>
          <button onClick={handleCancel}>Retake!</button>
        </div>
      ) : (
        <div>
          <Camera
            isFullscreen={isFullscreen}
            onTakePhotoAnimationDone = { handleAnimationDone }
            onCameraStart = { handleCameraStart }
            onCameraError = { (error) => { handleCameraError(error); } }
            idealFacingMode = {FACING_MODES.USER}
            idealResolution = {{width: 600, height: 900}}
            imageType = {IMAGE_TYPES.JPG}
            imageCompression = {0.97}
            isMaxResolution = {false}
            isImageMirror = {false}
            isSilentMode = {false}
            isDisplayStartCameraError = {true}
            sizeFactor = {1}
          />
        </div>
      )
    }
    </div>
  );
};

Add.propTypes = {
  dataUri: PropTypes.string,
  isFullscreen: PropTypes.bool
};

export default Add;