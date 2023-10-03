import { ICamera } from './interface';

export abstract class AbstractCamera<T extends THREE.Camera = THREE.Camera> implements ICamera<T> {
    protected _instance: T;

    public getInstance(): T {
        return this._instance;
    }

    public abstract resize(width: number, height: number): void;
}
