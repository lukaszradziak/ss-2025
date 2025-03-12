import {LercData} from 'lerc'

export const lercToCanvas = (decoded: LercData) => {
    const canvas = document.createElement('canvas')
    canvas.width = decoded.width
    canvas.height = decoded.height
    const ctx = canvas.getContext('2d')

    if (ctx === null) {
        throw new Error('ctx is not created')
    }

    const imageData = ctx.createImageData(decoded.width, decoded.height)

    for (let i = 0; i < decoded.mask.length; i++) {
        const value = decoded.pixels[0][i]
        imageData.data[i * 4] = value      // R
        imageData.data[i * 4 + 1] = value  // G
        imageData.data[i * 4 + 2] = value  // B
        imageData.data[i * 4 + 3] = 255    // A
    }
    ctx.putImageData(imageData, 0, 0)

    return canvas
}
