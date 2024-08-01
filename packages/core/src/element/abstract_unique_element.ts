import { IAbstractGenericDB } from '../database/interface';
import { AbstractGenericElement } from './abstract_generic_element';
import { IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractUniqueElement<
    D extends IAbstractGenericDB = IAbstractGenericDB,
    C extends IElementCreateArgs = IElementCreateArgs,
    U extends IElementUpdateArgs = Partial<C>,
> extends AbstractGenericElement<D, C, U> {}
