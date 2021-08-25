import {useMapEvents} from "react-leaflet";
import {useState} from "react";

export function InputComponent({doTask}) {
    const [edit, setEdit] = useState()
    const [value, setValue] = useState()

    const handleChange = (e) => {
        doTask(e);
    }

    return null
}
