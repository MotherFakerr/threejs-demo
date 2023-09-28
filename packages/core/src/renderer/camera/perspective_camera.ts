import * as THREE from 'three';
import { AbstractCamera } from './abstract_camera';

export class PerspectiveCamera extends AbstractCamera<THREE.PerspectiveCamera> {
    constructor(fov?: number, aspect?: number, near?: number, far?: number) {
        super();
        this._instance = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._instance.position.z = 5;
    }

    public set aspect(v: number) {
        this._instance.aspect = this.aspect;
    }
}
