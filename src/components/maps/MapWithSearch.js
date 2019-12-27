import React, { Component } from 'react';
import Geocode from "react-geocode";
// import * as data from "../data/skateboard-parks.json";
// import CurrentLocation from './CurrentLocation.js';
import {
    withGoogleMap,
    withScriptjs,
    GoogleMap,
    Marker,
    InfoWindow
  } from "react-google-maps";
Geocode.setApiKey("AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI");
Geocode.enableDebug();

const API_KEY = 'AIzaSyCukFLNeMl4inkvLQ8ZNNQzbC3q1zmcibI';
const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const { SearchBox } = require('react-google-maps/lib/components/places/SearchBox')

const MapWithASearchBox = compose(
    withProps(),
    lifecycle({
        componentWillMount() {
            const refs = {}
            this.setState({
                bounds: null,
                center: {
                    lat: 10.7292764, lng: 106.696505
                },
                markers: [],

                onMapMounted: ref => {
                    refs.map = ref;
                },
                onBoundsChanged: () => {
                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    })
                },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },
                onMarkerClick:()=>{

                },
                onPlacesChanged: () => {
                    const places = refs.searchBox.getPlaces();
                    const bounds = new window.google.maps.LatLngBounds();

                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport)
                        } else {
                            bounds.extend(place.geometry.location)
                        }
                    });
                    const nextMarkers = places.map(place => ({

                        position: place.geometry.location,
                    }));
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);

                    const location ={
                        lat:places[0].geometry.location.lat(),
                        lng:places[0].geometry.location.lng(),
                    }
                    localStorage.setItem('lat', location.lat)
                    localStorage.setItem('lng',location.lng)
                    localStorage.setItem('address', places[0].formatted_address)
                },
            })
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        ref={props.onMapMounted}
        defaultZoom={15}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
    >
        <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}
        >
            <input
                type="text"
                placeholder="Search for your Place"
                style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `240px`,
                    height: `32px`,
                    marginTop: `27px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                }}
            />
        </SearchBox>

        {props.markers.map((marker, index, i) =>

            <div>
                <Marker key={index}
                        position={marker.position}
                        icon={{
                            path: "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                            fillColor: "#0000ff",
                            fillOpacity: 1.0,
                            strokeWeight: 0,
                            scale: 1.25,
                        }}
                />
                <InfoWindow key={i} position= {marker.position}>
                    <div><h5>Nơi Tổ Chức</h5></div>
                </InfoWindow>
            </div>
        )}



    </GoogleMap>
);

export default class MapWithSearch extends Component {

    render() {

        let map;
        if (this.props.center.lat !== undefined) {
            map = <div>
                <MapWithASearchBox
                    googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: this.props.height }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        } else {
            map = <div style={{ height: this.props.height }} />
        }
        return (map)
    }
}

