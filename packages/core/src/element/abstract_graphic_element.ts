import { CalculatorMgr, ICalculator } from '../calculator';
import { DBManager } from '../database';
import { IAbstractGraphicDB } from '../database/interface';
import { ElementIdPool } from '../id/id_pool';
import { ISysView } from '../sys_view';
import { AbstractElement } from './abstract_element';
import { ElementClass, IAbstractGraphicElement, IElementCreateArgs, IElementUpdateArgs } from './interface';

export abstract class AbstractGraphicElement<
        D extends IAbstractGraphicDB = IAbstractGraphicDB,
        C extends IElementCreateArgs = IElementCreateArgs,
        U extends IElementUpdateArgs = Partial<C>,
    >
    extends AbstractElement<D, C, U>
    implements IAbstractGraphicElement
{
    protected _calculatorObservers: ICalculator[] = [];

    constructor(view: ISysView, idPool: ElementIdPool) {
        super(view, idPool);
        // eslint-disable-next-line no-proto
        const Ctor = (this as ANY).__proto__.constructor as ElementClass;
        const DbCtor = DBManager.getDBCtor(Ctor);
        const calculators = CalculatorMgr.getCalculator(DbCtor);
        this._calculatorObservers.push(...calculators);
    }

    public async create(args: C, disableRender?: boolean): Promise<this> {
        super.create(args);
        if (!disableRender) {
            for (const observer of this._calculatorObservers) {
                // eslint-disable-next-line no-await-in-loop
                await observer.execute(this._db);
            }
        }
        return this;
    }

    public async update(args: U, disableRender?: boolean): Promise<this> {
        const oldDB = this.db.dump();
        super.update(args);
        const newDB = this.db.dump();
        if (!disableRender) {
            const updateKeys: string[] = [];
            Object.entries(oldDB).forEach(([k, v]) => {
                if (newDB[k] !== undefined && v !== newDB[k]) {
                    updateKeys.push(k);
                }
            });

            for (const observer of this._calculatorObservers) {
                if (observer.ifUpdate(updateKeys)) {
                    // eslint-disable-next-line no-await-in-loop
                    await observer.execute(this._db);
                }
            }
        }
        return this;
    }
}
