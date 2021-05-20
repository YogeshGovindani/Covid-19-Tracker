import React from 'react';
import { Map as LeafletMap, TileLayer, Circle, Popup } from 'react-leaflet';
import './Map.css';
import { red, green } from '@material-ui/core/colors';

const showCricles = (data, casesType = 'cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={"#cc1034"}
            fillColor={"#cc1034"}
            radius={Math.sqrt(country[casesType]) * 300}
        >
            <Popup>
                <div>{country.country}</div>
                <div>Cases: {country.cases}</div>
                <div>Recovered: {country.recovered}</div>
                <div>Deaths: {country.deaths}</div>
            </Popup>
        </Circle>
    ))
)

function Map(props) {
    return (
        <div className="map">
            <LeafletMap center={props.center} zoom={props.zoom} >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showCricles(props.countries, props.casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
