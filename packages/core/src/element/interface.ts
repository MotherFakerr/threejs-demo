import { ElementId } from '../id/element_id';
import { ElementIdPool } from '../id/id_pool';
import { ISysDocument } from '../sys_document/interface';
import { AbstractUniqueElement } from './abstract_unique_element';
import { AbstractUniqueGraphicElement } from './abstract_unique_graphic_element';

export interface IAbstractElement {
    id: ElementId;
    create(args: ANY): this;
    update(args: ANY, disableUpdate?: boolean): Promise<this>;
    getCurDoc(): ISysDocument;
}

export interface IAbstractGraphicElement extends IAbstractElement {
    executeCalculators(params: KV): Promise<void>;
}

export type ElementClass<T extends IAbstractElement = IAbstractElement> = {
    new (doc: ISysDocument, idPool: ElementIdPool): T;
};

export type UniqueElementClass<T extends AbstractUniqueElement = AbstractUniqueElement> = {
    new (doc: ISysDocument, idPool: ElementIdPool): T;
};

export type UniqueGraphicElementClass<T extends AbstractUniqueGraphicElement = AbstractUniqueGraphicElement> = {
    new (doc: ISysDocument, idPool: ElementIdPool): T;
};
