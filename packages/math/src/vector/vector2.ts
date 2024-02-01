/* eslint-disable @typescript-eslint/naming-convention */
import * as THREE from 'three';

export class Vector2 extends THREE.Vector2 {
    public static O(): Vector2 {
        return new Vector2();
    }

    public static X(x?: number): Vector2 {
        return new Vector2(x, 0);
    }

    public static Y(y?: number): Vector2 {
        return new Vector2(0, y);
    }
}
