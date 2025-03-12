const DATA_BASE_URL =  import.meta.env.VITE_URL_DATA || ''

export const config = {
    POTREE: {
        JSON_FILE: `${DATA_BASE_URL}data/6/pointclouds/2473/ept/ept.json`,
    },
    OPEN_LAYERS: {
        RASTER_499_METADATA: `${DATA_BASE_URL}data/6/rasters/499/499/metadata.json`,
        RASTER_499_TILE: `${DATA_BASE_URL}data/6/rasters/499/499/{z}/{x}/{y}.lerc`,
        RASTER_500_METADATA: `${DATA_BASE_URL}data/6/rasters/500/500/metadata.json`,
        RASTER_500_TILE: `${DATA_BASE_URL}data/6/rasters/500/500/{z}/{x}/{y}.webp`,
        VECTOR_METADATA: `${DATA_BASE_URL}/data/6/vectors/2472/2472.geojson`,
    },
    LERC: {
        PATH: './lerc-wasm.wasm',
    },
}
