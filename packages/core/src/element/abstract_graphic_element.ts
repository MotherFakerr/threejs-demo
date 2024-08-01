import { CalculatorMgr, ICalculator } from '../calculator';
import { DBManager } from '../database';
import { IAbstractGraphicDB } from '../database/interface';
import { ElementIdPool } from '../id/id_pool';
import { ISysDocument } from '../sys_document';
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

    constructor(doc: ISysDocument, idPool: ElementIdPool) {
        super(doc, idPool);
        // eslint-disable-next-line no-proto
        const Ctor = (this as ANY).__proto__.constructor as ElementClass;
        const DbCtor = DBManager.getDBCtor(Ctor);
        const calculators = CalculatorMgr.getCalculator(DbCtor);
        this._calculatorObservers.push(...calculators);
    }

    public async initElement(args: C, disableRender = false): Promise<this> {
        this._safeInitDB(args);
        if (!disableRender) {
            await this._notifyCalculators();
        }
        return this;
    }

    public async updateElement(args: U, disableRender?: boolean | undefined): Promise<this> {
        const oldDB = this.db.dump();
        this._safeUpdateDB(args);
        const newDB = this.db.dump();
        if (!disableRender) {
            const updateKeys: string[] = [];
            Object.entries(oldDB).forEach(([k, v]) => {
                if (newDB[k] !== undefined && v !== newDB[k]) {
                    updateKeys.push(k);
                }
            });

            await this._notifyCalculators(updateKeys);
        }
        return this;
    }

    private async _notifyCalculators(updateKeys?: string[]): Promise<void> {
        await Promise.all(
            this._calculatorObservers
                .filter((observer) => (updateKeys ? observer.ifUpdate(updateKeys) : true))
                .map((observer) => observer.execute(this.db)),
        );
    }
}
