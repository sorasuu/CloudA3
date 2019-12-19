import React, { Component } from "react";
import MaterialTable from "material-table";
import { Redirect, Link } from "react-router-dom";
import MapWithAllMarker from "../layout/MapWithAllMarker";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button } from "@material-ui/core";
class Dashboard extends Component {
  render() {
    const { auth, notifications } = this.props;
    // if (!auth.uid) return <Redirect to='/signin' />
    return (


        <div className="dashboard">
          <div>
            <MapWithAllMarker />
          </div>


      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // sites: state.firestore.ordered.sites,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: "notifications", limit: 3, orderBy: ["time", "desc"] }
  ])
)(Dashboard);
