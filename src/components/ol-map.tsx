import {useEffect, useRef, useState} from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import useSWR from 'swr'
import {fetcher} from '../utils/swr.ts'
import {Metadata, MapBuilder} from '../services/map-builder.ts'

interface Layer {
    id: number;
    name: string;
    opacity: number;
    visible: boolean;
}

function OlMap() {
    const metadata499 = useSWR<Metadata>(MapBuilder.RASTER_499_METADATA, fetcher)
    const metadata500 = useSWR<Metadata>(MapBuilder.RASTER_500_METADATA, fetcher)
    const mapRef = useRef<Map>()
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [layers, setLayers] = useState<Layer[]>([])

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const mapBuilder = new MapBuilder();
            await mapBuilder.setup();

            if (isMounted) {
                mapRef.current = mapBuilder.getMap(
                    mapDivRef.current as HTMLDivElement,
                    metadata499.data as Metadata,
                    metadata500.data as Metadata,
                );

                setLayers([
                    { id: 1, name: 'RGB Raster', opacity: 1, visible: true },
                    { id: 2, name: 'Elevation Raster', opacity: 0.5, visible: true },
                ])
            }
        };

        if (!mapRef.current && metadata499.data && metadata500.data) {
            load();
        }

        return () => {
            isMounted = false;

            if (mapRef.current) {
                mapRef.current.setTarget(undefined);
            }

            mapRef.current = undefined;
        };
    }, [metadata499.data, metadata500.data]);

    useEffect(() => {
        if (!mapRef.current) {
            return
        }

        for (const index in layers) {
            const mapLayer = mapRef.current?.getAllLayers()[index];

            if (mapLayer) {
                mapLayer.setOpacity(layers[index].opacity)
                mapLayer.setVisible(layers[index].visible)
            }
        }
    }, [layers])

    const updateLayerOpacity = (id: number, newOpacity: number) => {
        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === id ? { ...layer, opacity: newOpacity } : layer
            )
        )
    }

    const updateLayerVisibility = (id: number, newVisibility: boolean) => {
        setLayers(prevLayers =>
            prevLayers.map(layer =>
                layer.id === id ? { ...layer, visible: newVisibility } : layer
            )
        )
    }

    return (
        <>
            {metadata499.isLoading || metadata500.isLoading ? <div>Loading...</div> : null}
            {metadata499.error ? <div>Error: {metadata499.error}</div> : null}
            {metadata500.error ? <div>Error: {metadata500.error}</div> : null}
            <div ref={mapDivRef} style={{height: '500px', width: '100%'}}></div>
            <div>
                {layers.map((layer) => (
                    <div key={layer.id} style={{ display: 'flex', gap: '5px', padding: '5px' }}>
                        <div style={{ width: '160px' }}>{layer.name}</div>
                        <input
                            type="checkbox"
                            defaultChecked={layer.visible}
                            onChange={(e) => updateLayerVisibility(
                                layer.id,
                                e.target.checked
                            )}
                        />
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            defaultValue={layer.opacity}
                            onChange={(e) => updateLayerOpacity(
                                layer.id,
                                parseFloat(e.target.value)
                            )}
                        />
                        {(layer.opacity*100).toFixed(0)} %
                    </div>
                ))}
            </div>
        </>
    );
}

export default OlMap
