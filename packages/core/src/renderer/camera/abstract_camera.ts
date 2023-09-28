export class AbstractCamera<T extends THREE.Camera = THREE.Camera> {
    protected _instance: T;

    public getInstance(): T {
        return this._instance;
    }
}
