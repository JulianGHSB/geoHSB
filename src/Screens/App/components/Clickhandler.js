import { useMapEvents} from "react-leaflet";

export function ClickHandler({doTask}) {
        const map = useMapEvents({
            click: () => {
                if (doTask) doTask();
                map.locate()
            },
            locationfound: (location) => {
                console.log('location found:', location)
            },
        });
        return null
}
