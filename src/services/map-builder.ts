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
import ImageTile from 'ol/source/ImageTile'
import * as ol from 'ol'
import {lercToCanvas} from '../utils/canvas'
import { GeoJSON } from 'ol/format'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import {config} from '../config/config'

export interface Metadata {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
    resolutions: number[];
    tileSize: number;
}

export class MapBuilder {
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
            locateFile: () => config.LERC.PATH
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

        const layerStreetMap = this.getStreetMapLayer()
        const layer500 = this.getLayer500(metadata500)
        const layer499 = this.getLayer499(metadata499)
        const layerVector = this.getVectorLayer()

        return new Map({
            target: domElement,
            layers: [
                layerStreetMap,
                layer500,
                layer499,
                layerVector,
            ],
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
            url: config.OPEN_LAYERS.RASTER_500_TILE,
            projection: this.projection,
            tileGrid: tileGrid,
            wrapX: false
        })

        return new TileLayer({
            source: tileSource
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
            url: config.OPEN_LAYERS.RASTER_499_TILE,
            projection: this.projection,
            tileGrid: tileGrid,
            wrapX: false,
            tileLoadFunction: async (imageTile, src) => {
                if (!(imageTile instanceof ol.ImageTile)) {
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

    private getVectorLayer() {
        return new VectorLayer({
            source: new VectorSource({
                format: new GeoJSON(),
                url: config.OPEN_LAYERS.VECTOR_METADATA,
            })
        })
    }

    private getStreetMapLayer() {
        const attributions = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
        const source = new ImageTile({
            attributions: attributions,
            url: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=' + import.meta.env.VITE_OPEN_STREET_MAP_KEY,
            tileSize: 512,
            maxZoom: 20,
        })

        return new TileLayer({
            source: source,
        })
    }
}
