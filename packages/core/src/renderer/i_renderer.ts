import { ICamera } from './camera/interface';

export interface IThreeRenderer {
    render(): void;
    resize(width: number, height: number): void;
    getCamera(): ICamera;
    getScene(): THREE.Scene;
    addGeoObject(...objs: THREE.Object3D[]): void;
    removeGeoObject(...objs: THREE.Object3D[]): void;
}
