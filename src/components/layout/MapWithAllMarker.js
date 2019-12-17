import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import MapClusterer from './MapClusterer'
import {Grid, Divider} from '@material-ui/core'
import { Link } from 'react-router-dom'
import {Button} from '@material-ui/core'
import { firestoreConnect } from 'react-redux-firebase'
import SiteList from '../sites/SiteList'
import Notifications from '../dashboard/Notifications'
import { connect } from 'react-redux'
import { compose } from 'redux'


const API_KEY = 'AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI'

const MapWrapped = withScriptjs(withGoogleMap(MapClusterer));


class MapWithAllMarker extends React.Component {
  state={
    sites:null
  }
  UNSAFE_componentWillReceiveProps(nextProps){
    if(nextProps.sites){
      this.setState({
        sites: nextProps.sites
      })
    }
  }
  render() {
    console.log(this.props, "AllMarker Props")
    return (
      // <Grid container spacing={3}>
      this.state.sites?
        <Grid item xs={12} style={{width:"100%", height:"80vh"}}>
          <MapWrapped
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            props={this.props}
          />
       </Grid>:null
    //     <Grid item xs={1}>
    //     <Link to= "/create"><Button color = "#39B04B">Tạo Sự Kiện</Button></Link>
    //     <Divider/>
    //     <p>Danh Sách:</p>

    //     {this.props.sites ? this.props.sites.map(site => (
    //       <Link key={site.id} to={'/site/'+site.id}>
    //       <div className="row">
    //         <div className="col xs=6 md=6 sm=6">{site.title}</div>
    //         <div className="col xs=6 md=6 sm=6">{site.showMap}</div>
    //       </div> 
    //       </Link>
    //     )) : null}
    //     </Grid>
    //   </Grid>
    );
  }
}

const mapStateToProps = (state) => {
    // console.log(state);
    return {
      sites: state.firestore.ordered.sitesApproved,
      // auth: state.firestore.auth,
      // notifications: state.firestore.ordered.notifications
    }
  }
  
  export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      // { collection: 'sites', where:[["pending","==",false]] },
      // { collection: 'notifications', limit: 3, orderBy: ['time', 'desc']}
    ])
  )(MapWithAllMarker)
