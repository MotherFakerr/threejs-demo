import * as THREE from 'three';
import { AbstractCamera } from './abstract_camera';

export class OrthographicCamera extends AbstractCamera<THREE.OrthographicCamera> {
    constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number) {
        super();
        this._instance = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        this._instance.position.z = 5;
    }

    public resize(width: number, height: number): void {
        this._instance.left = -width / 2;
        this._instance.right = width / 2;
        this._instance.top = height / 2;
        this._instance.bottom = -height / 2;
        this._instance.updateProjectionMatrix();
    }
}
