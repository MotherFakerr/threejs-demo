import { PointLight, PointLightHelper, Vector3 } from 'three';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../abstract_geo_element';

export interface IGPointLightInit extends IAbstractGeoElementInit {
    position: Vector3;
    color?: number;
    intensity?: number;
    distance?: number;
    decay?: number;
}

export class GPointLight extends AbstractGeoElement {
    protected _renderObjects: PointLight[];

    protected _debugObjects: PointLightHelper[];

    public create(params: IGPointLightInit): this {
        const { position, color, intensity, distance, decay, isDebug } = params;
        const pointLight = new PointLight(color, intensity, distance, decay);
        pointLight.position.set(position.x, position.y, position.z);
        this._renderObjects = [pointLight];

        if (isDebug) {
            const pointLightHelper = new PointLightHelper(pointLight, 3);
            this._debugObjects = [pointLightHelper];
        }
        return this;
    }
}
