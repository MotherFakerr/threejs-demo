import { EN_CAMERA_TYPE, ICamera } from './camera';

export interface IRenderer {
    render(): void;
    resize(width: number, height: number): void;
    getCamera(): ICamera;
}

export interface IThreeRenderOptions {
    /** camera options------------------------ */
    cameraType?: EN_CAMERA_TYPE;
    fov?: number;
    near?: number;
    far?: number;
}
