import L from "leaflet";
import shp from "shpjs";
import {useEffect} from "react";
import {useMap} from "react-leaflet";

export default function Shapefile({ url }) {
    const map = useMap()

    useEffect(() => {
        const geo = L.geoJson(
            { features: [] },
            {
                onEachFeature: function popUp(f, l) {
                    let out = [];
                    if (f.properties) {
                        for (const key in f.properties) {
                            out.push(key + ": " + f.properties[key]);
                        }
                        l.bindPopup(out.join("<br />"));
                    }
                }
            }
        ).addTo(map);

        shp(url).then(function (data) {
            geo.addData(data);
        });
    }, []);

    return null;
}
