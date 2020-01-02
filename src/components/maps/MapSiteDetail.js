import {GoogleMap, InfoWindow, Marker} from "react-google-maps";
import React from "react";

export function MapMarker(site) {
    return (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: 10.7296192, lng: 106.6943174 }}
            // defaultOptions={{ styles: mapStyles }}
        >
            <Marker
                position={{
                    lat: parseFloat(site.site.location.lat),
                    lng: parseFloat(site.site.location.lng)
                }}
                // icon={}
            >

                <InfoWindow>
                    <b>{site.site.title}</b>
                </InfoWindow>
            </Marker>
        </GoogleMap>
    );
}