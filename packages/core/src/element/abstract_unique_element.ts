import { IAbstractDB } from '../database/interface';
import { AbstractElement } from './abstract_element';
import { IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractUniqueElement<
    D extends IAbstractDB = IAbstractDB,
    C extends IElementCreateArgs = IElementCreateArgs,
    U extends IElementUpdateArgs = Partial<C>,
> extends AbstractElement<D, C, U> {}
