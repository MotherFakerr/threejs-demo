export abstract class AbstractCamera<T extends THREE.Camera = THREE.Camera> {
    protected _instance: T;

    public getInstance(): T {
        return this._instance;
    }

    public abstract resize(width: number, height: number): void;
}
