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

    firestore.collection('sites').doc(site.id).update({
      summary: site.summary,
    }).then(() => {
      dispatch({ type: 'UPDATE_SITE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'UPDATE_SITE_ERROR' }, err);
    });
  }
};

export const updateSite = (siteField) => {
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();

    firestore.collection('sites').doc(siteField.id).update({
      siteField
    }).then(() => {
      dispatch({ type: 'UPDATE_SITE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'UPDATE_SITE_ERROR' }, err);
    });
  }
};

export const sendTool = (tool) =>{
  return (dispatch , getState, {getFirestore})=>{
    const firestore = getFirestore();
    firestore.collection('tools').doc(tool.id).set({
      tool
    }).then(() => {
      dispatch({ type: 'TOOL_SITE_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'TOOL_SITE_ERROR' }, err);
    });
  }
};

