/* eslint-disable @typescript-eslint/naming-convention */
import * as THREE from 'three';

export class Vector3 extends THREE.Vector3 {
    public static O(): Vector3 {
        return new Vector3();
    }

    public static X(x?: number): Vector3 {
        return new Vector3(x, 0, 0);
    }

    public static Y(y?: number): Vector3 {
        return new Vector3(0, y, 0);
    }

    public static Z(z?: number): Vector3 {
        return new Vector3(0, 0, z);
    }

    public normalized(): this {
        return this.clone().normalize();
    }

    public copy(v: Vector3): this {
        return this.set(v.x, v.y, v.z);
    }
}
