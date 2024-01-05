import { AbstractGeoElement } from '../geo_element';
import { AbstractDB } from './abstract_db';

export abstract class AbstractGraphicDB<T extends AbstractGeoElement = AbstractGeoElement> extends AbstractDB {
    protected _geoElements: T[];

    public get geoElements(): T[] {
        return this._geoElements;
    }

    public setGeoElements(eles: T[]): void {
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
            this.getRenderer().delElementsByIds(...delIDs);
        }

        this._geoElements = eles;
    }
}
