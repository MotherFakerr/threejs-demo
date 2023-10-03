export interface ICamera<T extends THREE.Camera = THREE.Camera> {
    getInstance(): T;
    resize(width: number, height: number): void;
}

export enum EN_CAMERA_TYPE {
    PRESPECTIVE,
    ORTHOGRAPHIC,
}

export interface IPerspectiveCameraOptions {
    fov: number;
    aspect: number;
    near: number;
    far: number;
}

export interface IOrthographicCameraOptions {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
}

export interface IPerspectiveCamera extends ICamera<THREE.PerspectiveCamera>, IPerspectiveCameraOptions {}

export interface IOrthographicCamera extends ICamera<THREE.OrthographicCamera>, IOrthographicCameraOptions {}
