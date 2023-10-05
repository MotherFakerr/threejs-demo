import { Scene } from 'three';
import { EN_CAMERA_TYPE, ICamera, IOrthographicCameraOptions, IPerspectiveCameraOptions } from './camera';

export interface IRenderer {
    render(): void;
    resize(width: number, height: number): void;
    getCamera(): ICamera;
    getScene(): Scene;
}

export interface IThreeRenderOptions {
    isDebug?: boolean;
    /** camera options------------------------ */
    cameraType?: EN_CAMERA_TYPE;
    perspectiveCameraOptions?: IPerspectiveCameraOptions;
    orthographicCameraOptions?: IOrthographicCameraOptions;
}
