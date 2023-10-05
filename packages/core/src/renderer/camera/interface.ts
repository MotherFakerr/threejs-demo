import { Vector3 } from 'three';

export interface ICamera<T extends THREE.Camera = THREE.Camera> {
    getInstance(): T;
    position: Vector3;
    lookAt(x: number, y: number, z: number): void;
    resize(width: number, height: number): void;
    updateProjectionMatrix(): void;
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
