import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutingMachineLayer = (props) => {
    const instance = L.Routing.control({
        waypoints: [L.latLng(36.200321277244,-86.77083949234186), L.latLng(36.200321277244, -86.77083949234186)]
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
