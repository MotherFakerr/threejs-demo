import { AbstractDB } from '../database/abstract_db';
import { AbstractElement } from './abstract_element';
import { IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractUniqueElement<
    D extends AbstractDB = AbstractDB,
    C extends IElementCreateArgs = IElementCreateArgs,
    U extends IElementUpdateArgs = Partial<C>,
> extends AbstractElement<D, C, U> {}
