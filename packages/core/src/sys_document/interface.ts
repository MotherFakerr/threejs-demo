import { AbstractUniqueElement } from '../element/abstract_unique_element';
import { AbstractUniqueGraphicElement } from '../element/abstract_unique_graphic_element';
import { ElementClass, IAbstractElement, UniqueElementClass, UniqueGraphicElementClass } from '../element/interface';
import { ElementId } from '../id/element_id';
import { IRenderDocument } from '../renderer/i_render_document';
import { ISysView } from '../sys_view';

export interface ISysDocument {
    /**
     * @deprecated
     */
    getSysView(): ISysView;
    getRenderDoc(): IRenderDocument;
    createElement<T extends IAbstractElement>(Ctor: ElementClass<T>, params: Parameters<T['create']>[0]): Promise<T>;
    getElementById(eleId: number | ElementId): IAbstractElement | undefined;
    getElementsByIds(...eleIds: (number | ElementId)[]): IAbstractElement[];
    delElementsByIds(...eleIds: (number | ElementId)[]): void;
    getAllElements(): IAbstractElement[];
    getOrCreateUniqueElement<T extends AbstractUniqueElement>(Ctor: UniqueElementClass<T>): T;
    getOrCreateUniqueGraphicElement<T extends AbstractUniqueGraphicElement>(Ctor: UniqueGraphicElementClass<T>): T;
}
