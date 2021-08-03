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

const Nav = ({user, signOut, signIn, handleAdd, album}) => {
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
          user.displayName === "Ben Clemens"
          ?
          <div className="goodbye">
            {user.displayName} signed in.
            <button className="secondary-button" >Choose album</button>
            <button className="secondary-button" onClick={signOut}>Sign out</button>
          </div>
          : null
        }
    </div>
  );
  
  return user ? <Start /> : <Auth />;
};

const App = (props) => {
  const [albums, setAlbums] = useState([]);
  const [count, setCount] = useState(0);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentView, setCurrentView] = useState('loading');
  const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  useEffect(() => {
    let isSubscribed = true;
    const GetAlbumList = async () => {
      const ref = firebaseDatabase.ref();
      await ref.once('value').then(snapshot => {
        if (isSubscribed) {
          const list = Object.keys(snapshot.val());
          setAlbums(list);
          setCurrentAlbum(list[list.length - 1]);
          setCurrentView('show');
        }
      }).catch(error => {
        console.log(error);
      });
    };
    GetAlbumList();
    return () => isSubscribed = false;
  }, [currentAlbum]);

  const signIn = () => {
    firebase.auth().signInWithRedirect(googleAuthProvider);
  }

  const signOut = () => {
    firebase.auth().signOut();
  }

  const handleShow = () => setCurrentView('show');
  const handleAdd = () => setCurrentView('add');

  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <FirebaseAuthConsumer>
        {({ user }) => {
          return (
            <div className="app">
              <Nav user={user} signOut={signOut} signIn={signIn} handleShow={handleShow} handleAdd={handleAdd} album={currentAlbum} albums={albums} />
              { currentView === 'show' ? <Show album={currentAlbum} count={count} setCount={setCount} /> : null }
              { currentView === 'add' ? <Add album={currentAlbum} count={count} setCount={setCount} setCurrentView={setCurrentView} /> : null }
            </div>
          );
        }}
        </FirebaseAuthConsumer>
    </FirebaseAuthProvider>
  );
}

export default App;
