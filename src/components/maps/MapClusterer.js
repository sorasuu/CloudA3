import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import {Link} from 'react-router-dom'

function MapClusterer(props) {
  // console.log(props);
  const [isOpen, setOpenInfo] = useState(false);
  const [markerIndex, setMarkerIndex] = useState(0);
  const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
  const [center, setCenter] = useState({
    lat: 10.7292764, lng: 106.696505
  });
  const handleClick = (site,index) => {
    setOpenInfo(true);
    setMarkerIndex(index);
    // setCenter(
    //     {
    //       lat: parseFloat(site.location.lat),
    //       lng: parseFloat(site.location.lng)
    //     }
    // )
  };

  return (
      <GoogleMap
          defaultZoom={10}
          center={center}
          // onBoundsChanged={}
      >
        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={40}
        >
          {props.props.sites ? props.props.sites.map((site, index) => (
              <Marker
                  key={site.id}
                  position={{
                    lat: parseFloat(site.location.lat),
                    lng: parseFloat(site.location.lng)
                  }}
                  onMouseOver={()=>handleClick(site, index)}
                  animation = {site.id === props.currentId ? window.google.maps.Animation.BOUNCE : null}
                  icon={{
                    url:'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg',
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
              >
                {isOpen && markerIndex === index && (
                    <InfoWindow
                        onMouseLeave={() => {
                          setOpenInfo(false);
                        }}
                    >
                      <div>
                        <h6>{site.title}</h6>
                        <p>{site.content}</p>
                        <Link to={`/site/${site.id}`}>Chi Tiết</Link>
                      </div>
                    </InfoWindow>
                )
                }
              </Marker>
          )) : null}
        </MarkerClusterer>
      </GoogleMap>
  );
}
export default MapClusterer;