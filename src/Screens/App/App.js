import logo from '../../logo.svg';
import './App.css';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMapEvent, GeoJSON} from 'react-leaflet';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Button, Pane, Text, majorScale, toaster, Card, Heading, PlusIcon, Spinner} from "evergreen-ui";
import {ClickHandler} from "./components/Clickhandler";
import * as PropTypes from "prop-types";
import Shapefile from "./components/Shapefile";
import axios from "axios";
import urlFile from "./url.json";
import {generateColor} from "../../utils/colorUtils";
import {Legend} from "./components/Legend";
import { v4 as uuidv4 } from 'uuid';
import RoutingMachine from "./components/RoutingMachine";

const showClick = (loc) => console.log(loc);

function MapConsumer(props) {
  return null;
}

const REQPARAMS = {
  outputFormat: 'application/json',
  maxFeatures: 5000,
  request: "GetFeature",
  service: "WFS"
}

MapConsumer.propTypes = {children: PropTypes.func};

function App() {
  const [allLayers, setAllLayers] = useState([]);
  const [pureData, setPureData] = useState([]);
  const [ready, setReady] = useState(false);
  const [routeA, setRouteA] = useState({});
  const [routeB, setRouteB] = useState({});
  const [handleRouteA, setHandleRouteA] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState([36.16592421016811, -86.78202485392626]);
  const markerRef = useRef(null)
  const routingRef = useRef(null)

 useEffect(() => {
    if (routingRef.current && routeA.latA && routeB.latB) {
      routingRef.current.setWaypoints([[routeA.latA, routeA.lnA], [routeB.latB, routeB.lnB]]);
    }
  }, [routeA, routeB, routingRef]);

  useEffect(() => {
    const fetchData = async () => {
      let aLayers = [];
      let pureD = [];
      const reqs = urlFile;
      const reqData = reqs?.map(async (req) => {
        const res = await axios.get(req.url, {params: REQPARAMS});
        const obj = await res.data;
        obj.name = req.name;
        obj.id = req.id;
        obj.type = req.type;
        return obj;
      });
      reqData?.forEach((req) => {
        const color = generateColor();
        req.then((r) => {
          r.color = color;
          pureD = [...pureD, r];

              const layer = r?.features?.map((data) => {
                data.uuid = uuidv4();
                return <GeoJSON key={data.uuid} data={data} style={{color: color}} />
              })
              aLayers = [...aLayers, layer];
              setAllLayers(aLayers);
          setPureData(pureD);
            }
        );
      });
      // toaster.notify('data loaded successfully');
    };
    fetchData();
  },[])

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

  const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            const pos = marker.getLatLng()
            console.log(pos)
            if ( handleRouteA) setRouteA({ latA: pos.lat, lnA: pos.lng})
            else setRouteB({ latB: pos.lat, lnB: pos.lng});
            setHandleRouteA(!handleRouteA);
            setSelectedPosition([
              pos.lat,
              pos.lng
            ])
          }
        },
      }),
      [],
  )

  const Markers = () => {

    const map = useMapEvents({
      click(e) {
        if ( handleRouteA) setRouteA({ latA: e.latlng.lat, lnA: e.latlng.lng})
        else setRouteB({ latB: e.latlng.lat, lnB: e.latlng.lng});
        setHandleRouteA(!handleRouteA);
        setSelectedPosition([
          e.latlng.lat,
          e.latlng.lng
        ]);
      },
    })
    const markerMsg = `Latitude: ${selectedPosition[0]}
              Longitude: ${selectedPosition[1]}`;
    return (
        selectedPosition ?
            <Marker
                ref={markerRef}
                key={selectedPosition[0]}
                position={selectedPosition}
                draggable
                eventHandlers={eventHandlers}
            >  <Popup>
              {markerMsg}
            </Popup></Marker>
            : null
    )

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
      </header>
        { ready ? <Legend legendItems={pureData}/>
        : <Pane border
              elevation={2}
              justifyContent={'center'}
              alignItems={'center'}
              backgroundColor={'rgba(243, 243, 234, 0.74)'}
              style={{ position: 'absolute', right: 0, top: 0, margin: 5, padding: 5, flexDirection: 'column', minHeight: 50, borderRadius: 16}}
              marginX={majorScale(2)}>
          <Spinner size={40} />
        </Pane> }
        <MapContainer
            className="App-Map"
            center={[36.16542406265114, -86.7796292611359]}
            zoom={13}
            whenReady={() => setReady(true)}
            onViewportChanged={onViewportChanged}
            viewport={viewport}
            dragging
            doubleClickZoom
            scrollWheelZoom
            attributionControl
            zoomControl>
          <Markers />
          <RoutingMachine ref={routingRef} routeA={routeA} routeB={routeB} />
          <ClickHandler doTask={showClick}/>
          <MapConsumer>
            {(map) => {
              console.log('map center:', map.getCenter())
              return null
            }}</MapConsumer>
        {/*  <Shapefile url.json="https://services3.arcgis.com/PWXNAH2YKmZY7lBq/arcgis/rest/services/HuntingAllowed/FeatureServer"/>*/}
          {allLayers}
          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles"
          />
        </MapContainer>
    </div>
  );
}

export default App;
