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

export default class MapWithSearch extends Component {
    render() {
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
                    <Marker key={index} position={marker.position} />
                        <InfoWindow key={i} position= {marker.position}>
                        <div><h5>Nơi Tổ Chức</h5></div>
                        </InfoWindow>
                    </div>
                )}
                

                
            </GoogleMap>
        );
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

