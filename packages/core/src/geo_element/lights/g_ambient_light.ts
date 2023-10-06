import { AmbientLight } from 'three';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../abstract_geo_element';

export interface IGAmbientLightInit extends IAbstractGeoElementInit {
    color?: number;
    intensity?: number;
}

export class GAmbientLight extends AbstractGeoElement {
    protected _renderObjects: AmbientLight[];

    public create(params: IGAmbientLightInit): this {
        const { color, intensity, isDebug } = params;
        const ambientLight = new AmbientLight(color, intensity);
        this._renderObjects = [ambientLight];

        if (isDebug) {
            //
        }
        return this;
    }
}
