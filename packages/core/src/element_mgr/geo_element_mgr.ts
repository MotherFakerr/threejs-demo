import { AbstractGeoElement } from '../geo_element';

export class GeoElementMgr {
    private readonly _geoElements = new Map<number, AbstractGeoElement>();

    public getAllElements(): AbstractGeoElement[] {
        return [...this._geoElements.values()];
    }

    public addElements(...elements: AbstractGeoElement[]): void {
        for (const element of elements) {
            const id = element.id.toNum();
            this._geoElements.set(id, element);
        }
    }

    public getElementById(id: number): AbstractGeoElement | undefined {
        return this._geoElements.get(id);
    }

    public getElementsByIds(...ids: number[]): AbstractGeoElement[] {
        const res = [];
        for (const id of ids) {
            const element = this._geoElements.get(id);
            if (element) {
                res.push(element);
            }
        }

        return res;
    }

    public delElementsByIds(...ids: number[]): void {
        for (const id of ids) {
            this._geoElements.delete(id);
        }
    }
}
