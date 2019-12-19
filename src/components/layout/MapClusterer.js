import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";


function MapClusterer(props) {

  const [selectedPlace, setSelectedPlace] = useState(null);
  const { MarkerClusterer } = require("react-google-maps/lib/components/addons/MarkerClusterer");
  // const [markerMap, setMarkerMap] = useState({});
  // const markerLoadHandler = (marker, site) => {
  //   return setMarkerMap(prevState => {
  //     return { ...prevState, [site.id]: marker };
  //   });
  // };

  console.log(props,"props MapClusterer");

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

  return (

      <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: 10.7296192, lng: 106.6943174 }}
          // defaultOptions={{ styles: mapStyles }}
      >
        <MarkerClusterer
            // onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={40}
        >

          {props.props.sites ? props.props.sites.map(site => (
              <Marker
                  key={site.id}
                  // onLoad={marker => markerLoadHandler(marker, site)}
                  position={{
                    lat: parseFloat(site.location.lat),
                    lng: parseFloat(site.location.lng)
                  }}
                  // animation={window.google.maps.Animation.BOUNCE}
                  // animation = {null}
                  onMouseOver={() => {
                    setSelectedPlace(site);
                  }}

                  icon={{
                    url:'https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg',
                    scaledSize: new window.google.maps.Size(40, 40),

                  }}
              />
          )) : null}

        </MarkerClusterer>
        {selectedPlace && (
            <InfoWindow
                onCloseClick={() => {
                  setSelectedPlace(null);
                }}

                position={{
                  lat: parseFloat(selectedPlace.location.lat),
                  lng: parseFloat(selectedPlace.location.lng)
                }}
            >
              <div>
                <h6>{selectedPlace.title}</h6>
                <p>{selectedPlace.content}</p>
              </div>
            </InfoWindow>
        )
        }

      </GoogleMap>
  );
}
export default MapClusterer;