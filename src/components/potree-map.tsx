import {useEffect, useRef} from 'react'
import {config} from '../config/config'

function PotreeMap() {
    const mapDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const viewer = new Potree.Viewer(mapDivRef.current)
        viewer.setEDLEnabled(true)
        viewer.setFOV(60)
        viewer.setPointBudget(1*1000*1000)
        viewer.loadSettingsFromURL()

        Potree.loadPointCloud(config.POTREE.JSON_FILE, 'points', (e) => {
            const scene = viewer.scene
            const pointcloud = e.pointcloud
            const material = pointcloud.material
            material.size = 1
            material.pointSizeType = Potree.PointSizeType.ADAPTIVE
            material.shape = Potree.PointShape.SQUARE
            scene.addPointCloud(pointcloud)
            viewer.fitToScreen()
        })

        return () => {
            viewer.renderer.dispose()
        }
    }, [])

    return (
        <div ref={mapDivRef} style={{ height: '500px', position: 'relative' }}></div>
    )
}

export default PotreeMap
