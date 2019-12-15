import firebase from 'firebase/app';
export const signIn = (credentials) => {
  return (dispatch, getState, {getFirebase}) => {
    const getfirebase = getFirebase();
    
    getfirebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
      dispatch({ type: 'LOGIN_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_ERROR', err });
    });

  }
}
export const signInWithFaceBook = () => {
  return (dispatch, getState, { getFirestore}) => {
    var provider = new firebase.auth.FacebookAuthProvider();
      const firestore = getFirestore()
     firebase.auth().signInWithRedirect(provider).then(resp => {
       console.log("success")
     
    }).then(() => {
      dispatch({ type: 'LOGIN_FACEBOOK_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_FACEBOOK_ERROR', err });
    });
    
    

  }
}

export const signInWithGoogle = () => {
  return (dispatch, getState, { getFirestore}) => {
    var provider = new firebase.auth.GoogleAuthProvider();
      const firestore = getFirestore()
     firebase.auth().signInWithRedirect(provider).then(resp => {
       console.log("success")
     
    }).then(() => {
      dispatch({ type: 'LOGIN_GOOGLE_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'LOGIN_GOOGLE_ERROR', err });
    });}}

export const signOut = () => {
  return (dispatch, getState, {getFirebase}) => {
    const getfirebase = getFirebase();

    getfirebase.auth().signOut().then(() => {
      dispatch({ type: 'SIGNOUT_SUCCESS' })
    });
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, {getFirebase, getFirestore}) => {
    const getfirebase = getFirebase();
    const firestore = getFirestore();

    getfirebase.auth().createUserWithEmailAndPassword(
      newUser.email, 
      newUser.password
    ).then(resp => {
      return firestore.collection('users').doc(resp.user.uid).set({
        displayName: newUser.firstName +" "+newUser.lastName,
        email:  newUser.email,
      });
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' });
    }).catch((err) => {
      dispatch({ type: 'SIGNUP_ERROR', err});
    });
  }
}