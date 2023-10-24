import { AbstractUniqueElement } from '../element/abstract_unique_element';
import { ElementClass, IAbstractElement, UniqueElementClass } from '../element/interface';
import { ElementId } from '../id/element_id';
import { ISysView } from '../sys_view';

export interface ISysDocument {
    getSysView(): ISysView;
    createElement<T extends IAbstractElement>(Ctor: ElementClass<T>, params: Parameters<T['create']>[0]): Promise<T>;
    getElementById(eleId: number | ElementId): IAbstractElement | undefined;
    getElementsByIds(...eleIds: (number | ElementId)[]): IAbstractElement[];
    delElementsByIds(...eleIds: (number | ElementId)[]): void;
    getAllElements(): IAbstractElement[];
    getOrCreateUniqueElement<T extends AbstractUniqueElement>(Ctor: UniqueElementClass<T>): T;
}
