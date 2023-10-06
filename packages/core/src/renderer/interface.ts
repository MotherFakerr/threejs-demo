import { Scene } from 'three';
import { EN_CAMERA_TYPE, ICamera, IOrthographicCameraOptions, IPerspectiveCameraOptions } from './camera';
import { ElementId } from '../id/element_id';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';

export interface IRenderer {
    render(): void;
    resize(width: number, height: number): void;
    getCamera(): ICamera;
    getScene(): Scene;
    createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T;
    getElementById(eleId: number | ElementId): AbstractGeoElement | undefined;
    getElementsByIds(...eleIds: (number | ElementId)[]): AbstractGeoElement[];
    delElementsByIds(...eleIds: (number | ElementId)[]): void;
    getAllElements(): AbstractGeoElement[];
}

export interface IThreeRenderOptions {
    isDebug?: boolean;
    /** camera options------------------------ */
    cameraType?: EN_CAMERA_TYPE;
    perspectiveCameraOptions?: IPerspectiveCameraOptions;
    orthographicCameraOptions?: IOrthographicCameraOptions;
}
