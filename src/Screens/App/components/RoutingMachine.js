import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import {dataStore} from "../../../stores/dataStore";

const createRoutingMachineLayer = ({setRouteCoords}) => {

    const { getState } = dataStore;

    const instance = L.Routing.control({
        waypoints: [],
        serviceUrl: 'http://127.0.0.1:5000/route/v1'});


    instance.on("routeselected", (e) => setRouteCoords(e.route.coordinates, getState().data));

    return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
