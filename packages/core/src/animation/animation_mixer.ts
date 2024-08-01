import * as THREE from 'three';
import { ElementId } from '../id/element_id';
import { IRenderDocument } from '../renderer/i_render_document';
import { ElementIdPool } from '../id/id_pool';
import { IAbstractGeoElement } from '../geo_element';
import { IAnimationMixer } from './interface';

export class AnimationMixer implements IAnimationMixer {
    protected _id: ElementId;

    protected _renderer: IRenderDocument;

    protected _instance: THREE.AnimationMixer;

    protected _animatedElement: IAbstractGeoElement;

    constructor(renderer: IRenderDocument, idPool: ElementIdPool, geoElement: IAbstractGeoElement) {
        this._instance = new THREE.AnimationMixer(geoElement.renderObject);
        this._animatedElement = geoElement;
        this._renderer = renderer;
        this._id = new ElementId(idPool);
    }

    public get id(): ElementId {
        return this._id;
    }

    public get instance(): THREE.AnimationMixer {
        return this._instance;
    }
}
