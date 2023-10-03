import * as THREE from 'three';
import { AbstractCamera } from './abstract_camera';
import { IOrthographicCamera, IOrthographicCameraOptions } from './interface';

export class OrthographicCamera extends AbstractCamera<THREE.OrthographicCamera> implements IOrthographicCamera {
    constructor({ left, right, top, bottom, near, far }: IOrthographicCameraOptions) {
        super();
        this._instance = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    }

    public get left(): number {
        return this._instance.left;
    }

    public set left(v: number) {
        this._instance.left = v;
    }

    public get right(): number {
        return this._instance.right;
    }

    public set right(v: number) {
        this._instance.right = v;
    }

    public get top(): number {
        return this._instance.top;
    }

    public set top(v: number) {
        this._instance.top = v;
    }

    public get bottom(): number {
        return this._instance.bottom;
    }

    public set bottom(v: number) {
        this._instance.bottom = v;
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
        this._instance.left = -width / 2;
        this._instance.right = width / 2;
        this._instance.top = height / 2;
        this._instance.bottom = -height / 2;
        this._instance.updateProjectionMatrix();
    }
}
