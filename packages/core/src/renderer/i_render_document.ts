import { EN_CAMERA_TYPE, ICamera, IOrthographicCameraOptions, IPerspectiveCameraOptions } from './camera';
import { ElementId } from '../id/element_id';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';

export interface IRenderDocument {
    updateView(): void;

    createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T;
    getGeoElementById(eleId: number | ElementId): AbstractGeoElement | undefined;
    getGeoElementsByIds(...eleIds: (number | ElementId)[]): AbstractGeoElement[];
    delGeoElementsByIds(...eleIds: (number | ElementId)[]): void;
    getAllElements(): AbstractGeoElement[];
}

export interface IThreeRenderOptions {
    isDebug?: boolean;
    showFrameStats?: boolean;
    isAnimate?: boolean;
    /** camera options------------------------ */
    autoResize?: boolean;
    cameraType?: EN_CAMERA_TYPE;
    perspectiveCameraOptions?: IPerspectiveCameraOptions;
    orthographicCameraOptions?: IOrthographicCameraOptions;
}
