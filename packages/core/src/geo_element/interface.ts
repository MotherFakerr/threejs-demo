import { ElementIdPool } from '../id/id_pool';
import { IRenderDocument } from '../renderer/i_render_document';
import { AbstractGeoElement } from './abstract_geo_element';

export type GElementClass<T extends AbstractGeoElement = AbstractGeoElement> = {
    new (renderer: IRenderDocument, idPool: ElementIdPool): T;
};
