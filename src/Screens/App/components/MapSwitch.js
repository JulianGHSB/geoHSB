import {useMapEvents} from "react-leaflet";
import {useState} from "react";
import {Card, Heading, majorScale, Pane, PlusIcon, Switch, Text} from "evergreen-ui";

export function MapSwitch({name, initialChecked, doTask}) {
    const [value, setValue] = useState()
    const [checked, setChecked] = useState(initialChecked)

    const handleChange = (isChecked) => {
        if (doTask) doTask(isChecked)
        setChecked(isChecked)
    }

    return <Pane border
                 elevation={2}
                 style={{
                     position: 'absolute',
                     right: 0,
                     top: 150,
                     margin: 5,
                     padding: 15,
                     flexDirection: 'column',
                     minHeight: 50,
                     backgroundColor: 'white',
                     borderRadius: 16,
                     justifyContent: 'center',
                     alignItems: 'center'
                 }}
                 marginX={majorScale(2)}>
        <Heading style={{marginBottom: 10}}>{name}</Heading>
        <Switch marginLeft="30%" checked={checked} onChange={(e) => handleChange(e.target.checked)} />
    </Pane>
}
