import { ElementDBClass } from '../database/interface';
import { ICalculator } from './interface';

class CalculatorMgrImpl {
    private _calculatorCtorMap = new Map<ElementDBClass, ICalculator[]>();

    public registerCalculator(EleClazz: ElementDBClass) {
        return (CalculatorClazz: Class) => {
            const calculator = new CalculatorClazz();
            if (this._calculatorCtorMap.has(EleClazz)) {
                this._calculatorCtorMap.get(EleClazz)!.push(calculator);
            } else {
                this._calculatorCtorMap.set(EleClazz, [calculator]);
            }
        };
    }

    public getCalculator(Clazz: ElementDBClass): ICalculator[] {
        const calculators = this._calculatorCtorMap.get(Clazz);
        if (!calculators) {
            console.error(`${Clazz}的calculator未注册`);
        }
        return calculators ?? [];
    }
}

export const CalculatorMgr = new CalculatorMgrImpl();
