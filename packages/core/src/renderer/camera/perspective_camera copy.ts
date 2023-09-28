import * as THREE from 'three';
import { AbstractCamera } from './abstract_camera';

export class OrthographicCamera extends AbstractCamera<THREE.OrthographicCamera> {
    constructor(left?: number, right?: number, top?: number, bottom?: number, near?: number, far?: number) {
        super();
        this._instance = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        this._instance.position.z = 5;
    }

    // public set aspect(v: number) {
    //     this._instance.aspect = this.aspect;
    // }
}
