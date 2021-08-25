import { useMapEvents} from "react-leaflet";

export function ClickHandler({doTask}) {
        const map = useMapEvents({
            click: () => {
                map.locate()
            },
            locationfound: (location) => {
                doTask(location);
                console.log('location found:', location)
            },
        });
        return null
}