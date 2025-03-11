declare namespace Potree {
    interface Renderer {
        dispose(): void;
    }

    class Viewer {
        constructor(domElement: HTMLElement | null, options?: object);
        scene: Scene;
        renderer: Renderer;
        fitToScreen(): void;
        setEDLEnabled(enabled: boolean): void;
        setFOV(fov: number): void;
        setPointBudget(budget: number): void;
        loadSettingsFromURL(): void;
    }

    interface Scene {
        addPointCloud(pointcloud: PointCloud): void;
    }

    interface PointCloud {
        material: PointCloudMaterial;
    }

    interface PointCloudMaterial {
        size: number;
        pointSizeType: PointSizeType;
        shape: PointShape;
    }

    enum PointSizeType {
        ADAPTIVE,
    }

    enum PointShape {
        SQUARE,
    }

    interface LoadPointCloudEvent {
        pointcloud: PointCloud;
    }

    function loadPointCloud(
        url: string,
        name: string,
        callback: (e: LoadPointCloudEvent) => void
    ): void;
}
