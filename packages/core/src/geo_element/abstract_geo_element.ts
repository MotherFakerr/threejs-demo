import { Object3D } from 'three';
import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id';
import { IRenderer } from '../renderer';

export interface IAbstractGeoElementInit {
    isDebug?: boolean;
}

export abstract class AbstractGeoElement {
    protected _id: ElementId;

    protected _renderer: IRenderer;

    protected _debugObjects: Object3D[] = [];

    protected abstract _renderObjects: Object3D[];

    constructor(renderer: IRenderer, idPool: ElementIdPool) {
        this._renderer = renderer;
        this._id = new ElementId(idPool);
    }

    public get id(): ElementId {
        return this._id;
    }

    public get renderObjects(): Object3D[] {
        return [...this._renderObjects, ...this._debugObjects];
    }

    public getCurRenderer(): IRenderer {
        return this._renderer;
    }

    public abstract create(args: ANY): this;
}
