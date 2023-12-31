import { AbstractUniqueGraphicElement, DBManager } from '@threejs-demo/core';
import { Vector3 } from '@threejs-demo/math';
import { PointLightDB } from './point_light_db';

export interface IPointLightParams {
    position: THREE.Vector3;
    color?: number;
    intensity?: number;
    distance?: number;
    decay?: number;
}

@DBManager.registerElementDB(PointLightDB)
export class PointLightElement extends AbstractUniqueGraphicElement<PointLightDB, IPointLightParams> {
    protected async _createDB(args: IPointLightParams): Promise<void> {
        const { position, color, intensity, distance, decay } = args;
        this.db.position = position ?? new Vector3();
        this.db.color = color ?? 0xfffff;
        this.db.intensity = intensity ?? 0;
    }

    protected async _updateDB(args: IPointLightParams): Promise<void> {
        const { color, intensity } = args;
        if (color) this.db.color = color;
        if (intensity) this.db.intensity = intensity;
    }
}
