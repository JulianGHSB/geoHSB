import logo from '../../logo.svg';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {useState} from "react";

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

function App() {

  const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
  }

  const [viewport, setViewPort] = useState(DEFAULT_VIEWPORT);

  const handleClick = () => {
    setViewPort({ viewport: DEFAULT_VIEWPORT })
  }

  const onViewportChanged = viewport => {
    setViewPort({ viewport })
  }

  return (
    <div className="App">
      <header className="App-header">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
              integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
              crossOrigin=""/>
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
    crossOrigin=""/>
        <p>
          Geile Karte für Beamte
        </p>
        <MapContainer
            className="App-Map"
            center={[51.505, -0.09]}
            zoom={13}
            onViewportChanged={onViewportChanged}
            viewport={viewport}
            dragging
            doubleClickZoom
            scrollWheelZoom
            attributionControl
            zoomControl>
          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </header>
    </div>
  );
}

export default App;
