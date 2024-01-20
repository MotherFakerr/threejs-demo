import { EN_CAMERA_TYPE, ICamera, IOrthographicCameraOptions, IPerspectiveCameraOptions } from './camera';
import { ElementId } from '../id/element_id';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';
import { AnimationMixer } from '../animation/animation_mixer';

export interface IRenderDocument {
    updateView(): void;

    createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T;
    getGeoElementById(eleId: number | ElementId): AbstractGeoElement | undefined;
    getGeoElementsByIds(...eleIds: (number | ElementId)[]): AbstractGeoElement[];
    delGeoElementsByIds(...eleIds: (number | ElementId)[]): void;
    getAllGeoElements(): AbstractGeoElement[];

    createAnimationMixer(geoElement: AbstractGeoElement): AnimationMixer;
    getAnimationMixerById(aId: number | ElementId): AnimationMixer | undefined;
    getAnimationMixersByIds(...aId: (number | ElementId)[]): AnimationMixer[];
    delAnimationMixersByIds(...aId: (number | ElementId)[]): void;
    getAllAnimationMixers(): AnimationMixer[];
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
