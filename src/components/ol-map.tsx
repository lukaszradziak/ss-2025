import {useEffect, useRef} from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import ImageTile from 'ol/source/ImageTile'

const MAP_TILE = '/data/6/rasters/500/500/{z}/{x}/{y}.webp'

function OlMap() {
    const mapRef = useRef<Map>()
    const mapDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mapRef.current === undefined) {
            mapRef.current = new Map({
                target: mapDivRef.current as HTMLElement,
                layers: [
                    new TileLayer({
                        source: new ImageTile({
                            url: MAP_TILE,
                        }),
                    }),
                ],
                view: new View({
                    center: [0, 0],
                    zoom: 0,
                }),
            });
        }

        return () => {
            mapRef.current?.setTarget(undefined)
            mapRef.current = undefined
        }
    }, []);

    return (
        <div ref={mapDivRef} style={{height: '300px', width: '100%'}}></div>
    );
}

export default OlMap
