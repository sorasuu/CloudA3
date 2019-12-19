import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'
import { makeStyles, useTheme, Drawer, AppBar, Toolbar, List, 
        Typography, Divider, IconButton, ListItem, 
        ListItemIcon, ListItemText } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 240;
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
  console.log(auth);

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
