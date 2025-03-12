import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import {get as getProjection, Projection} from 'ol/proj'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultControls } from 'ol/control/defaults'
import { ScaleLine } from 'ol/control'
import TileGrid from 'ol/tilegrid/TileGrid'
import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import * as lerc from 'lerc'
import {ImageTile} from 'ol'
import {lercToCanvas} from '../utils/canvas.tsx'

export interface Metadata {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
    resolutions: number[];
    tileSize: number;
}

export class MapBuilder {
    public static RASTER_499_METADATA = (import.meta.env.VITE_URL_DATA || '') + 'data/6/rasters/499/499/metadata.json'
    public static RASTER_499_TILE = (import.meta.env.VITE_URL_DATA || '') + 'data/6/rasters/499/499/{z}/{x}/{y}.lerc'
    public static RASTER_500_METADATA = (import.meta.env.VITE_URL_DATA || '') + 'data/6/rasters/500/500/metadata.json'
    public static RASTER_500_TILE = (import.meta.env.VITE_URL_DATA || '') + 'data/6/rasters/500/500/{z}/{x}/{y}.webp'
    private projection?: Projection
    private lercLoaded: boolean = false

    public async setup(): Promise<void> {
        proj4.defs(
            'EPSG:2176',
            '+proj=tmerc +lat_0=0 +lon_0=15 +k=0.999923 +x_0=5500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        )
        register(proj4)
        this.projection = getProjection('EPSG:2176') || undefined;

        if (!this.projection) {
            throw new Error('Projection EPSG:2176 not found!')
        }

        await lerc.load({
            locateFile: () => './lerc-wasm.wasm'
        })
        this.lercLoaded = true
    }

    public getMap(domElement: HTMLDivElement, metadata499: Metadata, metadata500: Metadata): Map {
        if (!this.projection) {
            throw new Error('Call setup() before using getMap()')
        }

        const extent = [metadata500.minX, metadata500.minY, metadata500.maxX, metadata500.maxY]
        this.projection.setExtent(extent)

        const center = [
            (metadata500.minX + metadata500.maxX) / 2,
            (metadata500.minY + metadata500.maxY) / 2
        ]

        const layer500 = this.getLayer500(metadata500)
        const layer499 = this.getLayer499(metadata499)

        return new Map({
            target: domElement,
            layers: [layer499, layer500],
            view: new View({
                projection: this.projection,
                center: center,
                zoom: 0,
                minZoom: 0,
                maxZoom: metadata500.resolutions.length - 1,
                extent: extent
            }),
            controls: defaultControls().extend([new ScaleLine()])
        })
    }

    private getLayer500(metadata: Metadata): TileLayer {
        if (!this.projection) {
            throw new Error('Call setup() before using getLayer500()')
        }

        const extent = [metadata.minX, metadata.minY, metadata.maxX, metadata.maxY]
        this.projection.setExtent(extent)

        const tileGrid = new TileGrid({
            origin: [metadata.minX, metadata.maxY],
            resolutions: metadata.resolutions,
            tileSize: metadata.tileSize
        })

        const tileSource = new XYZ({
            url: MapBuilder.RASTER_500_TILE,
            projection: this.projection,
            tileGrid: tileGrid,
            wrapX: false
        })

        return new TileLayer({
            source: tileSource,
            opacity: 0.4
        })
    }

    private getLayer499(metadata: Metadata): TileLayer {
        if (!this.projection) {
            throw new Error('Call setup() before using getLayer499()')
        }

        if (!this.lercLoaded) {
            throw new Error('lerc not loaded, call setup() first!')
        }

        const tileGrid = new TileGrid({
            origin: [metadata.minX, metadata.maxY],
            resolutions: metadata.resolutions,
            tileSize: metadata.tileSize
        })

        const tileSource = new XYZ({
            url: MapBuilder.RASTER_499_TILE,
            projection: this.projection,
            tileGrid: tileGrid,
            wrapX: false,
            tileLoadFunction: async (imageTile, src) => {
                if (!(imageTile instanceof ImageTile)) {
                    throw new Error('imageTile must be of type ImageTile');
                }

                return fetch(src)
                    .then((response) => response.arrayBuffer())
                    .then((arrayBuffer) => {
                        const canvas = lercToCanvas(lerc.decode(arrayBuffer))
                        imageTile.getImage().setAttribute('src', canvas.toDataURL())
                    })
                    .catch((e) => {
                        console.warn(e);
                    })
            }
        })

        return new TileLayer({
            source: tileSource,
            opacity: 0.6
        })
    }
}
