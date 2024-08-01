import { IAbstractGenericDB } from '../database/interface';
import { AbstractElement } from './abstract_element';
import { IAbstractGenericElement, IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractGenericElement<
        D extends IAbstractGenericDB = IAbstractGenericDB,
        C extends IElementCreateArgs = IElementCreateArgs,
        U extends IElementUpdateArgs = Partial<C>,
    >
    extends AbstractElement<D, C, U>
    implements IAbstractGenericElement
{
    public async initElement(args: C): Promise<this> {
        this._safeInitDB(args);
        return this;
    }

    public async updateElement(args: U): Promise<this> {
        this._safeUpdateDB(args);
        return this;
    }
}
