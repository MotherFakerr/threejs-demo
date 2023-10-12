import { ElementIdPool } from '../id/id_pool';
import { IRenderer } from '../renderer/interface';
import { AbstractGeoElement } from './abstract_geo_element';

export type GElementClass<T extends AbstractGeoElement = AbstractGeoElement> = {
    new (renderer: IRenderer, idPool: ElementIdPool): T;
};
