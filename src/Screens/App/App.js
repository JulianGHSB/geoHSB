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
import {v4 as uuidv4} from 'uuid';
import RoutingMachine from "./components/RoutingMachine";
import pointInPolygon from 'point-in-polygon';
import {isEmpty, transformLatLongToLongLatPoint, transformLatLongToPoint} from "../../utils/dataUtils";
import {dataStore} from "../../stores/dataStore";
import create from "zustand";
import {reqGetData} from "../../actions/actions";
import {MapSwitch} from "./components/MapSwitch";
import {isArray} from "leaflet/src/core/Util";
import * as L from "leaflet";
import {booleanPointInPolygon, pointsWithinPolygon} from "@turf/turf";

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
    const [ready, setReady] = useState(false);
    const [routeA, setRouteA] = useState({});
    const [routeB, setRouteB] = useState({});
    const [handleRouteA, setHandleRouteA] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState([36.16592421016811, -86.78202485392626]);
    const [routeCoords, setRouteCoords] = useState([]);
    const markerRef = useRef(null)
    const routingRef = useRef(null)
    const [polygons, setPolygons] = useState([]);
    const useDataStore = create(dataStore);
    const data = useDataStore((state => state.data));
    const addElem = useDataStore(state => state.add);
    const [useRoutingClick, setUseRoutingClick] = useState(false);
    const [constraintViolated, setConstraintViolated] = useState({});
    const [violatedGEOJson, setViolatedGEOJson] = useState(null);
    const greenIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        iconSize: [26, 42],
    })

    useEffect(() => {
        if (routingRef.current && routeA.latA && routeB.latB) {
            routingRef.current.setWaypoints([[routeA.latA, routeA.lnA], [routeB.latB, routeB.lnB]]);
        }
    }, [routeA, routeB, routingRef]);

   useEffect(() => {
        if (!isEmpty(constraintViolated)){
            const arr = Object.entries(constraintViolated);
            const elem = arr.map(([key, value]) => {
               return <GeoJSON key={key + " hit"} data={value.polyObj} style={{color: 'white'}}/>
            })
            setViolatedGEOJson(elem)
        }
    }, [constraintViolated])

    useEffect(() => {
        const fetchData = async () => {
            const response = await reqGetData();
            const reqs = await response.json();
            let aLayers = [];
            const reqData = reqs?.map(async (req) => {
                const res = await axios.get(req.url, {params: REQPARAMS});
                const obj = await res.data;
                obj.name = req.name;
                obj.color = req.color;
                obj.id = req.id;
                obj.type = req.type;
                return obj;
            });
            reqData?.forEach((req) => {
                req.then((r) => {

                        const layer = r?.features?.map((data) => {
                            data.uuid = uuidv4();
                            data.areaType = r.type;
                            return <GeoJSON key={data.uuid} data={data} style={{color: r.color}}/>
                        })
                        aLayers = [...aLayers, layer];
                        setAllLayers(aLayers);

                        addElem(r);
                    }
                );
            });
            // toaster.notify('data loaded successfully');
        };
        fetchData();
    }, [])

    const DEFAULT_VIEWPORT = {
        center: [51.505, -0.09],
        zoom: 13,
    }

    const [viewport, setViewPort] = useState(DEFAULT_VIEWPORT);

    const handleClick = () => {
        setViewPort({viewport: DEFAULT_VIEWPORT})
    }

    const onViewportChanged = viewport => {
        setViewPort({viewport})
    }

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    const pos = marker.getLatLng()
                    if (handleRouteA) setRouteA({latA: pos.lat, lnA: pos.lng})
                    else setRouteB({latB: pos.lat, lnB: pos.lng});
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
                if (useRoutingClick) {
                    if (handleRouteA) setRouteA({latA: e.latlng.lat, lnA: e.latlng.lng})
                    else setRouteB({latB: e.latlng.lat, lnB: e.latlng.lng});
                    setHandleRouteA(!handleRouteA);
                } else {
                    setSelectedPosition([
                        e.latlng.lat,
                        e.latlng.lng
                    ]);
                }
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
                    icon={greenIcon}
                    eventHandlers={eventHandlers}
                > <Popup>
                    {markerMsg}
                </Popup></Marker>
                : null
        )

    }

    const clear = () => {
        setConstraintViolated({});
    }

    const saveCoords = (coords, geoData) => {
        const points = transformLatLongToLongLatPoint(coords);
        let hitMap = {};
        let succ = [];
        if (!isEmpty(coords) && !isEmpty(geoData)) {
            geoData.forEach((dataSet) => {
                dataSet.features.forEach((polyObj) => {
                    points.forEach((point) => {
                            const poly = polyObj?.geometry;
                            const name = polyObj?.properties?.NAME;
                            const type = polyObj?.areaType;
                          if (!isEmpty(point) && !isEmpty(poly)) {
                                const hit = booleanPointInPolygon(point, poly);
                                if (hit) {
                                    hitMap[polyObj.uuid] = {point, polyObj, name, type};
                                }
                            }
                        })
                });
            })
        }
        setConstraintViolated(hitMap);
        setRouteCoords(coords);
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
                    H.A.W.A. - Hunting Area Warning App
                </p>
            </header>
            {ready ? <>
                    <Legend legendItems={data}/>
                    <MapSwitch name="Click for Route" doTask={setUseRoutingClick} initialChecked={useRoutingClick}/>
                </>
                : <Pane border
                        elevation={2}
                        justifyContent={'center'}
                        alignItems={'center'}
                        backgroundColor={'rgba(243, 243, 234, 0.74)'}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            margin: 5,
                            padding: 5,
                            flexDirection: 'column',
                            minHeight: 50,
                            borderRadius: 16
                        }}
                        marginX={majorScale(2)}>
                    <Spinner size={40}/>
                </Pane>}
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
                <Markers/>
                <RoutingMachine ref={routingRef} data={data} setRouteCoords={saveCoords}/>
                <ClickHandler doTask={clear}/>
                <MapConsumer>
                    {(map) => {
                        console.log('map center:', map.getCenter())
                        return null
                    }}</MapConsumer>
                {/*  <Shapefile url.json="https://services3.arcgis.com/PWXNAH2YKmZY7lBq/arcgis/rest/services/HuntingAllowed/FeatureServer"/>*/}
                {allLayers}
                {violatedGEOJson}
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
