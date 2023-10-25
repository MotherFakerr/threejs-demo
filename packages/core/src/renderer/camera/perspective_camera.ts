import THREE from 'three';
import { AbstractCamera } from './abstract_camera';
import { IPerspectiveCamera, IPerspectiveCameraOptions } from './interface';

export class PerspectiveCamera extends AbstractCamera<THREE.PerspectiveCamera> implements IPerspectiveCamera {
    constructor({ fov, aspect, near, far }: IPerspectiveCameraOptions) {
        super();
        this._instance = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }

    public get fov(): number {
        return this._instance.fov;
    }

    public set fov(v: number) {
        this._instance.fov = v;
    }

    public get aspect(): number {
        return this._instance.aspect;
    }

    public set aspect(v: number) {
        this._instance.aspect = v;
    }

    public get near(): number {
        return this._instance.near;
    }

    public set near(v: number) {
        this._instance.near = v;
    }

    public get far(): number {
        return this._instance.far;
    }

    public set far(v: number) {
        this._instance.far = v;
    }

    public updateProjectionMatrix(): void {
        this._instance.updateProjectionMatrix();
    }

    public resize(width: number, height: number): void {
        this._instance.aspect = width / height;
        this._instance.updateProjectionMatrix();
    }
}
