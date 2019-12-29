import React from 'react'
import { Link } from 'react-router-dom'

import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'
import { makeStyles, AppBar, Toolbar, Typography} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  root: {
    flexGrow: 1,
    color: "black"
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = props => {
  const { auth, profile } = props;
  const links = auth.uid ? <SignedInLinks props={props} /> : <SignedOutLinks />;
  const classes = useStyles();

  return (
    <div>
      <AppBar
        position="static"
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
          <Link to="/">
            <Typography variant="title" className="title">
              <img src="img\VNSX-Logo.png" alt="logo" height={50} />
            </Typography>
          </Link>
          <div className={classes.root} />
          {links}
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
};

export default connect(mapStateToProps)(Navbar)
