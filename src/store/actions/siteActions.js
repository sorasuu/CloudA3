export const createSite = (site) => {
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const author = getState().firebase.auth;
    firestore.collection('sites').add({
      ...site,
      authorName: profile.displayName,
      authorId: author.uid,
      authorEmail: author.email,
      authorPhotoURL: author.photoURL,
      createdAt: new Date()
    }).then(() => {
      dispatch({ type: 'CREATE_SITE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'CREATE_SITE_ERROR' }, err);
    });
  }
};

export const editSite = (site) => {
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();

    firestore.collection('sites').doc(site.id).set({
      ...site,
    }).then(() => {
      dispatch({ type: 'UPDATE_SITE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'UPDATE_SITE_ERROR' }, err);
    });
  }
};
<<<<<<< HEAD
=======
export const updateSite = (site) => {
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();

    firestore.collection('sites').doc(site.id).update({
      "siteClicked":site.isClicked
    }).then(() => {
      dispatch({ type: 'UPDATE_SITE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'UPDATE_SITE_ERROR' }, err);
    });
  }
};
>>>>>>> e346a0d61f03bd6be9837a27d89d005ab05b1d82
