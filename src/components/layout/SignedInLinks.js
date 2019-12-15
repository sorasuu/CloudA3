import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'
import IconButton from '@material-ui/core/IconButton';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import Grid from '@material-ui/core/Grid';
import InputIcon from '@material-ui/icons/Input';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';

const SignedInLinks = (props) => {
  const {auth} = props
  return (
    <div>
      <Grid container spacing={3}>
      <Grid item xs={4}>
        <li color="black"><NavLink to='/profile' className="btn btn-floating  lighten-1">
          <img src={auth.photoURL}/>
        </NavLink></li>
        </Grid>
        <Grid item xs={4}>
      <IconButton color="black">
            <NotificationsIcon  />
          </IconButton>
        </Grid>
        <Grid item xs={4}>
      <IconButton  >
            <InputIcon  onClick={props.signOut}/>
          </IconButton>
        </Grid>
        </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    // sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
    // notifications: state.firestore.ordered.notifications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    // { collection: 'sites', orderBy: ['createdAt', 'desc'] },
    // { collection: 'notifications', limit: 3, orderBy: ['time', 'desc'] }
  ])
)(SignedInLinks) 
