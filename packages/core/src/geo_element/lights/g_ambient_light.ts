import THREE from 'three';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../abstract_geo_element';

export interface IGAmbientLightInit extends IAbstractGeoElementInit {
    color?: number;
    intensity?: number;
}

export class GAmbientLight extends AbstractGeoElement {
    protected _renderObject: THREE.AmbientLight;

    public create(params: IGAmbientLightInit): this {
        const { color, intensity, isDebug } = params;
        const ambientLight = new THREE.AmbientLight(color, intensity);
        this._renderObject = ambientLight;

        if (isDebug) {
            //
        }
        return this;
    }
}
