import React, { useState, useEffect } from 'react';
import Show from './Show';
import Add from './Add';
import firebase from './firebase/firebase';
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import {firebaseConfig} from './firebase/firebase';

import 'firebase/auth';
import 'firebase/database';
import './app.sass';
import './index.css';

const firebaseDatabase = firebase.database(); 

const Album = ({newAlbum, handleAlbumPush, handleAlbumChange}) => (
  <form className="albumForm" onSubmit={handleAlbumPush}>
    <input 
      autoFocus
      onBlur={handleAlbumPush}
      autoComplete="off"
      value={newAlbum}
      onChange={handleAlbumChange}
      placeholder="new album name"
      type="text" 
      name="album"
      className="albumInput"
    />
    <button className="secondary-button" type="submit">Add</button>
  </form>
);

const Nav = ({user, signOut, signIn, handleAdd, handleAddAlbum, album}) => {
  const Auth = () => (
    <div className="welcome">
        <div className="signup">
          <button className="primary-button" onClick={signIn}>Sign in with a Google account</button>
        </div>
    </div>
  );

  const Start = () => (
    <div className="auth">
        {
          album 
          ?
          <div className="hello">
            <button className="primary-button" onClick={handleAdd}>Add your photo</button>
          </div>
          : null
        }
        {
          user
          ?
          <div className="goodbye">
            <span className="label">Album: {album}</span>
            {
              user && (user.email === 'jenschultes@gmail.com' || user.email === 'ben.clemens@gmail.com')
              ?
              <button className="secondary-button" onClick={handleAddAlbum}>Start new album</button>
              : null
            }
            <button className="secondary-button" onClick={signOut}>Exit</button>
          </div>
          : null
        }
    </div>
  );
  
  return user ? <Start /> : <Auth />;
};

const App = (props) => {
  const [count, setCount] = useState(0);
  const [newAlbum, setNewAlbum] = useState('');
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentView, setCurrentView] = useState('loading');
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  useEffect(() => {
    let isSubscribed = true;
    const GetAlbumList = async () => {
      const ref = firebaseDatabase.ref();
      await ref.limitToLast(1).once('value').then(snapshot => {
        if (isSubscribed) {
          const list = snapshot.val();
          const label = Object.entries(list);
          setCurrentAlbum(label[0][1].album);
          setCurrentView('show');
        }
      }).catch(error => {
        console.log(error);
      });
    };
    GetAlbumList();
    return () => isSubscribed = false;
  }, [currentAlbum]);

  const signIn = () => firebase.auth().signInWithRedirect(googleAuthProvider);
  const signOut = () => firebase.auth().signOut();
  const handleShow = () => setCurrentView('show');
  const handleAdd = () => setCurrentView('add');
  const handleAddAlbum = () => setCurrentView('album');

  const handleAlbumChange = (e) => {
    setNewAlbum(e.target.value);
  }

  const handleAlbumPush = (e) => {
    e.preventDefault();
    const ref = firebaseDatabase.ref();
    const albumLabel = newAlbum.toString();
    ref.push({
      album: albumLabel
    }).then(() => {
      setCurrentView('loading');
      setNewAlbum('');
      setCurrentAlbum(newAlbum);
    });
  };

  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <FirebaseAuthConsumer>
        {({ user }) => {
          return (
            <div className="app">
              {
                currentView !== 'album' 
                ?
                <Nav
                  user={user}
                  handleAddAlbum={handleAddAlbum}
                  signOut={signOut}
                  signIn={signIn}
                  handleShow={handleShow}
                  handleAdd={handleAdd}
                  album={currentAlbum}
                />
                : null
              }
              { currentView === 'show' 
                ? 
                <Show
                  album={currentAlbum}
                  count={count}
                  setCount={setCount}
                /> 
                : null 
              }
              { currentView === 'add' 
                ? 
                <Add
                  album={currentAlbum}
                  count={count}
                  setCount={setCount}
                  setCurrentView={setCurrentView}
                />
                : null 
              }
              { currentView === 'album'
                ?
                <Album
                  newAlbum = {newAlbum}
                  handleAlbumPush = {handleAlbumPush}
                  handleAlbumChange = {handleAlbumChange}
                />
                : null
              }
            </div>
          );
        }}
        </FirebaseAuthConsumer>
    </FirebaseAuthProvider>
  );
}

export default App;
