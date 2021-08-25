import {useMapEvents} from "react-leaflet";
import {useState} from "react";
import {Card, Heading, majorScale, Pane, PlusIcon, Text} from "evergreen-ui";

export function Legend({legendItems}) {
    const [value, setValue] = useState()
    console.log(legendItems)
    const items = legendItems.map((r) => {

        return <Pane key={r?.id} display="flex" alginItems="center" textAlign={'center'}
                     style={{flex: 1 / legendItems.length, backgroundColor: 'white', borderRadius: 16}}>
            <Card border style={{
                display: "flex",
                width: 16,
                height: 16,
                color: r.color,
                backgroundColor: r.color,
                borderRadius: 64,
                borderColor: 'grey',
                alignItems: "center",
                alignSelf: 'center'
            }}/>
            <Text textAlign={'center'} marginLeft={10}>{r?.name}</Text>
        </Pane>
    })

    return <Pane border
                 elevation={2}
                 style={{
                     position: 'absolute',
                     right: 0,
                     top: 0,
                     margin: 5,
                     padding: 15,
                     flexDirection: 'column',
                     minHeight: 50,
                     backgroundColor: 'white',
                     borderRadius: 16
                 }}
                 marginX={majorScale(2)}>
        <Heading style={{marginBottom: 5}}>Legend</Heading>
        {items}
        <Card borderRadius={12} marginTop={10} justifyContent={'center'} alignItems={'center'} backgroundColor={'rgba(111, 111, 250, 0.72)'} elevation={2}>
            <PlusIcon color='rgba(250, 250, 250, 1)' size={20}/></Card>
    </Pane>
}
