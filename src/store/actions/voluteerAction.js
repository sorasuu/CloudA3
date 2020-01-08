export const createVolunteer = (volunteer) => {
    return (dispatch, getState, {getFirestore}) => {
      const firestore = getFirestore();
      const authorId = getState().firebase.auth.uid;
      if(!authorId){
      firestore.collection('sites').doc(volunteer.siteId).collection('volunteers').doc(volunteer.id).set({
          ...volunteer,
          uid:null
      }).then(() => {
        dispatch({ type: 'CREATE_VOLUNTEER_SUCCESS' });
      }).catch(err => {
        dispatch({ type: 'CREATE_VOLUNTEER_ERROR' }, err);
      });}
    else {
        firestore.collection('sites').doc(volunteer.siteId).collection('volunteers').doc(volunteer.id).set({
          ...volunteer
            ,uid: authorId
          
        }).then(() => {
          dispatch({ type: 'CREATE_VOLUNTEER_SUCCESS' });
        }).catch(err => {
          dispatch({ type: 'CREATE_VOLUNTEER_ERROR' }, err);
        });
      }
    }
  };
export const sendEmail=(email)=>{
  return (dispatch, getState, {getFirestore}) => {
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;
    if(!authorId){
    firestore.collection('sites').doc(email.siteId).collection('emails').doc(email.id).set({
        ...email,
        uid:null
    }).then(() => {
      dispatch({ type: 'CREATE_EMAIL_SUCCESS' });
    }).catch(err => {
      dispatch({ type: 'CREATE_EMAIL_ERROR' }, err);
    });}
  }
}