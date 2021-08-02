import React, { useState, useEffect } from 'react';
import Show from './Show';
import Add from './Add';
import firebase from './firebase/firebase';
import withFirebaseAuth from 'react-with-firebase-auth';
import 'firebase/auth';
import 'firebase/database';
import './app.sass';
import './index.css';

const firebaseAppAuth = firebase.auth();
const firebaseDatabase = firebase.database();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};  

const Nav = ({user, signOut, signInWithGoogle, handleAdd, album}) => {
  console.log(user)
  const Auth = () => (
    <div className="welcome">
      <div className="signup">
        <button className="primary-button" onClick={signInWithGoogle}>Sign in with a Google account</button>
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
  const { user, signOut, signInWithGoogle } = props;
  const [albums, setAlbums] = useState([]);
  const [count, setCount] = useState(0);
  const [currentAlbum, setCurrentAlbum] = useState(null);
  const [currentView, setCurrentView] = useState('loading');

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

  const handleShow = () => setCurrentView('show');
  const handleAdd = () => setCurrentView('add');

  return (
    <div className="app">
      { <Nav user={user} signOut={signOut} signInWithGoogle={signInWithGoogle} handleShow={handleShow} handleAdd={handleAdd} album={currentAlbum} albums={albums} /> }
      { currentView === 'show' ? <Show album={currentAlbum} count={count} setCount={setCount} /> : null }
      { currentView === 'add' ? <Add album={currentAlbum} count={count} setCount={setCount} setCurrentView={setCurrentView} /> : null }
    </div>
  );
}

export default withFirebaseAuth({providers,firebaseAppAuth})(App);
