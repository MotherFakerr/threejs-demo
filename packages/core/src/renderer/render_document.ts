import * as THREE from 'three';
import { IRenderDocument, IThreeRenderOptions } from './i_render_document';
import { GeoElementMgr } from './geo_element_mgr';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';
import { ElementIdPool } from '../id/id_pool';
import { ElementId } from '../id/element_id';
import { IThreeRenderer } from './i_renderer';
import { ThreeRenderer } from './renderer';

export class RenderDocument implements IRenderDocument {
    private readonly _geoElementMgr: GeoElementMgr;

    private readonly _idPool = new ElementIdPool();

    private readonly _renderer: IThreeRenderer;

    constructor(private _container: HTMLElement, private _options: IThreeRenderOptions) {
        this._geoElementMgr = new GeoElementMgr();
        this._renderer = new ThreeRenderer(this._container, this._options);
    }

    public updateView(): void {
        this._renderer.render();
    }

    public createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T {
        const element = new Ctor(this as IRenderDocument, this._idPool).create({ ...params });
        this._geoElementMgr.addElements(element);
        this._renderer.addGeoObject(element.renderObject);
        return element;
    }

    public getGeoElementById(gId: number | ElementId): AbstractGeoElement | undefined {
        const id = gId instanceof ElementId ? gId.toNum() : gId;
        return this._geoElementMgr.getElementById(id);
    }

    public getGeoElementsByIds(...gId: (number | ElementId)[]): AbstractGeoElement[] {
        const ids = gId.map((id) => (id instanceof ElementId ? id.toNum() : id));
        return this._geoElementMgr.getElementsByIds(...ids);
    }

    public delGeoElementsByIds(...gId: (number | ElementId)[]): void {
        const ids = gId.map((id) => (id instanceof ElementId ? id.toNum() : id));
        const elements = this._geoElementMgr.getElementsByIds(...ids);
        this._renderer.removeGeoObject(
            ...elements.reduce((allEles, ele) => {
                allEles.push(ele.renderObject);
                return allEles;
            }, [] as THREE.Object3D[]),
        );
        this._geoElementMgr.delElementsByIds(...ids);
        this._idPool.recycleIds(...ids);
    }

    public getAllElements(): AbstractGeoElement[] {
        return this._geoElementMgr.getAllElements();
    }

    public async onGeoElementUpdate(element: AbstractGeoElement): Promise<void> {
        const obj = element.renderObject.clone();
        this._renderer.removeGeoObject(element.renderObject);
        this._renderer.addGeoObject(obj);
    }
}
