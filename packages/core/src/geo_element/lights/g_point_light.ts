import THREE from 'three';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../abstract_geo_element';

export interface IGPointLightInit extends IAbstractGeoElementInit {
    position: THREE.Vector3;
    color?: number;
    intensity?: number;
    distance?: number;
    decay?: number;
}

export class GPointLight extends AbstractGeoElement {
    protected _renderObject: THREE.PointLight;

    public create(params: IGPointLightInit): this {
        const { position, color, intensity, distance, decay, isDebug } = params;
        const pointLight = new THREE.PointLight(color, intensity, distance, decay);
        pointLight.position.set(position.x, position.y, position.z);
        this._renderObject = pointLight;

        if (isDebug) {
            const pointLightHelper = new THREE.PointLightHelper(pointLight, 3);
            this._renderObject.add(pointLightHelper);
        }
        return this;
    }
}
