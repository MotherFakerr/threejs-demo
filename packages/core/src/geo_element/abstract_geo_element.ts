import { ElementId } from '../id/element_id';
import { IRenderer } from '../renderer';
import { ElementIdPool } from '../id/id_pool';

export interface IAbstractGeoElementInit {
    isDebug?: boolean;
}

export abstract class AbstractGeoElement {
    protected _id: ElementId;

    protected _renderer: IRenderer;

    protected abstract _renderObject: THREE.Object3D;

    constructor(renderer: IRenderer, idPool: ElementIdPool) {
        this._renderer = renderer;
        this._id = new ElementId(idPool);
    }

    public get id(): ElementId {
        return this._id;
    }

    public get renderObject(): THREE.Object3D {
        return this._renderObject;
    }

    public set renderObject(obj: THREE.Object3D) {
        this._renderObject = obj;
        this.notify();
    }

    public getRenderer(): IRenderer {
        return this._renderer;
    }

    // 删除scene中的obj重新塞入
    public notify(): void {
        const obj = this._renderObject.clone();
        obj.parent?.remove(this._renderObject);
        obj.parent?.add(obj);
    }

    public translate(dir: { x: number; y: number; z: number }): void {
        const matrix = this._renderObject.matrix.clone();
        const { x, y, z } = dir;
        matrix.makeTranslation(x, y, z);
        this._renderObject.applyMatrix4(matrix);
    }

    public abstract create(args: ANY): this;
}
