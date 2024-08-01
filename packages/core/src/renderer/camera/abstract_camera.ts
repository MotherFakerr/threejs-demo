import { Vector3 } from '@threejs-demo/math';
import { ICamera } from './interface';

export abstract class AbstractCamera<T extends THREE.Camera = THREE.Camera> implements ICamera<T> {
    protected _instance: T;

    public getInstance(): T {
        return this._instance;
    }

    public get position(): Vector3 {
        return new Vector3(this.getInstance().position.x, this.getInstance().position.y, this.getInstance().position.z);
    }

    public set position({ x, y, z }: Vector3) {
        this.getInstance().position.set(x, y, z);
    }

    public lookAt(x: number, y: number, z: number): void {
        this.getInstance().lookAt(x, y, z);
    }

    public abstract updateProjectionMatrix(): void;

    public abstract resize(width: number, height: number): void;
}
