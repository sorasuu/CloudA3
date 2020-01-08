
import {GoogleMap, InfoWindow, Marker} from "react-google-maps";
import React from "react";

export function MapMarker(props) {
    const site = props.site;
    const [isOpen, setOpen] = React.useState(true);
    const handleInfoWindow = () => {
        setOpen(!isOpen)
    };
    const handleClose=()=>{
        setOpen(false)
    };
    return (

        <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: 10.7296192, lng: 106.6943174 }}
            // defaultOptions={{ styles: mapStyles }}
        >
            <Marker
                position={{
                    lat: parseFloat(site.location.lat),
                    lng: parseFloat(site.location.lng)
                }}
                onClick={handleInfoWindow}
                // icon={}
            >
                {isOpen && (
                    <InfoWindow
                        onCloseClick={handleClose}
                    >
                        <div>
                        <h5>{site.title}</h5>
                            <p>{site.address}</p>
                        </div>
                    </InfoWindow>
                )}

            </Marker>
        </GoogleMap>
    );
}