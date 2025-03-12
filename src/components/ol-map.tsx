import {useEffect, useRef} from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import useSWR from 'swr'
import {fetcher} from '../utils/swr.ts'
import {Metadata, MapBuilder} from '../services/map-builder.ts'

function OlMap() {
    const metadata499 = useSWR<Metadata>(MapBuilder.RASTER_499_METADATA, fetcher)
    const metadata500 = useSWR<Metadata>(MapBuilder.RASTER_500_METADATA, fetcher)
    const mapRef = useRef<Map>()
    const mapDivRef = useRef<HTMLDivElement>(null)

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
    }, [metadata499, metadata500]);

    return (
        <>
            {metadata499.isLoading || metadata500.isLoading ? <div>Loading...</div> : null}
            {metadata499.error ? <div>Error: {metadata499.error}</div> : null}
            {metadata500.error ? <div>Error: {metadata500.error}</div> : null}
            <div ref={mapDivRef} style={{height: '500px', width: '100%'}}></div>
        </>
    );
}

export default OlMap
