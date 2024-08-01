import { AbstractGraphicElement, DBManager } from '@threejs-demo/core';
import { PointLightDB } from './point_light_db';
import { Vector3 } from '@threejs-demo/math';

export interface IPointLightParams {
    position: Vector3;
    color?: number;
    intensity?: number;
    distance?: number;
    decay?: number;
}

@DBManager.registerElementDB(PointLightDB)
export class PointLightElement extends AbstractGraphicElement<PointLightDB, IPointLightParams> {
    protected async _initDB(args: IPointLightParams): Promise<void> {
        await this._updateDB(args);
    }

    protected async _updateDB(args: IPointLightParams): Promise<void> {
        const { position, color, intensity, distance, decay } = args;
        if (position) this.db.position = position;
        if (color) this.db.color = color;
        if (intensity) this.db.intensity = intensity;
    }
}
