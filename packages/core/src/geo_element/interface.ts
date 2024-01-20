import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer/i_render_document';
import { AbstractGeoElement } from './abstract_geo_element';

export interface IAbstractGeoElement {
    renderObject: THREE.Object3D;
    getRenderer(): IRenderDocument;
    notify(): void;
    translate(dir: { x: number; y: number; z: number }): void;
    create(args: ANY): this;
}

export type GElementClass<T extends AbstractGeoElement = AbstractGeoElement> = {
    new (renderer: IRenderDocument, idPool: ElementIdPool): T;
};
