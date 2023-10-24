import { ElementClass } from '../element';
import { ICalculator } from './interface';

class CalculatorMgrImpl {
    private _calculatorCtorMap = new Map<ElementClass, ICalculator[]>();

    public registerCalculator(EleClazz: ElementClass) {
        return (CalculatorClazz: Class) => {
            const calculator = new CalculatorClazz();
            if (this._calculatorCtorMap.has(EleClazz)) {
                this._calculatorCtorMap.get(EleClazz)!.push(calculator);
            } else {
                this._calculatorCtorMap.set(EleClazz, [calculator]);
            }
        };
    }

    public getCalculator(EleClazz: ElementClass): ICalculator[] {
        const calculators = this._calculatorCtorMap.get(EleClazz);
        if (!calculators) {
            console.error(`${EleClazz}的calculator未注册`);
        }
        return calculators ?? [];
    }
}

export const CalculatorMgr = new CalculatorMgrImpl();
