import { CalculatorMgr, ICalculator } from '../calculator';
import { AbstractGeoElement } from '../geo_element/abstract_geo_element';
import { ElementIdPool } from '../id/id_pool';
import { ISysDocument } from '../sys_document/interface';
import { AbstractElement } from './abstract_element';
import { ElementClass, IAbstractGraphicElement } from './interface';

export abstract class AbstractGraphicElement<T extends AbstractGeoElement[] = AbstractGeoElement[]>
    extends AbstractElement
    implements IAbstractGraphicElement
{
    protected _calculatorObservers: ICalculator[] = [];

    protected _geoElements: T;

    constructor(doc: ISysDocument, idPool: ElementIdPool) {
        super(doc, idPool);
        // eslint-disable-next-line no-proto
        const calculators = CalculatorMgr.getCalculator((this as ANY).__proto__.constructor as ElementClass);
        this._calculatorObservers.push(...calculators);
    }

    public get geoElements(): T {
        return this._geoElements;
    }

    public setGeoElements(eles: T): void {
        const oldEles = this._geoElements;
        const newEles = eles;

        // id相同的为复用element
        const newIDs = newEles.map((ele) => ele.id.toNum());
        const delIDs: number[] = [];

        if (oldEles) {
            oldEles.forEach((ele) => {
                const id = ele.id.toNum();
                if (!newIDs.includes(id)) {
                    delIDs.push(id);
                }
            });

            // 删除不复用element
            this.getCurDoc()
                .getSysView()
                .getRenderer()
                .delElementsByIds(...delIDs);
        }

        this._geoElements = eles;
    }

    public async executeCalculators(params: KV): Promise<void> {
        const updateKeys: string[] = [];
        Object.entries(params).forEach(([k, v]) => {
            if (v) {
                updateKeys.push(k);
            }
        });

        for (const observer of this._calculatorObservers) {
            if (observer.ifUpdate(updateKeys)) {
                // eslint-disable-next-line no-await-in-loop
                await observer.execute(this);
            }
        }
    }
}
