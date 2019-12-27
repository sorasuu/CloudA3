import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import {Link} from 'react-router-dom'

function MapClusterer(props) {

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isOpen, setOpenInfo] = useState(false);
  const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
  console.log(selectedPlace, 'selectedPlace');
  console.log(props.props.sitesApproved, 'props');
      // window.google.maps.Animation.BOUNCE;
  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPlace(null)
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
  const handleClick = () => {
    setOpenInfo(true)
  };
  const handleMouseOver = (site) => {
    setSelectedPlace(site)
  };

  return (
      <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: 10.7296192, lng: 106.6943174 }}
      >
        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={40}
        >
          {props.props.sites ? props.props.sites.map(site => (
              <Marker
                  key={site.id}
                  position={{
                    lat: parseFloat(site.location.lat),
                    lng: parseFloat(site.location.lng)
                  }}
                  onClick={()=>handleClick(site)}
                  onMouseOver={() => handleMouseOver(site)}
                  animation = {site === selectedPlace ? window.google.maps.Animation.BOUNCE : null}
                  icon={{
                    url:'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg',
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
              >
                {isOpen && (
                    <InfoWindow
                        onCloseClick={() => {
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