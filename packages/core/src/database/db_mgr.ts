import { ElementClass } from '../element';
import { ElementDBClass } from './interface';

class DBManagerImpl {
    private _elementDBMap = new Map<ElementClass, ElementDBClass>();

    public registerElementDB(elementDBClass: ElementDBClass) {
        return (elementClass: ElementClass): void => {
            if (this._elementDBMap.has(elementClass)) throw new Error(`ElementDB for ${elementClass.toString()} has been registered`);
            this._elementDBMap.set(elementClass, elementDBClass);
        };
    }

    public getDBCtor(elementClass: ElementClass): ElementDBClass {
        const dbCtor = this._elementDBMap.get(elementClass);
        if (!dbCtor) {
            throw new Error(`${elementClass}的db未注册`);
        }

        return dbCtor;
    }
}

export const DBManager = new DBManagerImpl();
