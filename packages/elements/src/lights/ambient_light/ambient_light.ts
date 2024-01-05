import { AbstractUniqueGraphicElement, DBManager } from '@threejs-demo/core';
import { AmbientLightDB } from './ambient_light_db';

export interface IAmbientLightParams {
    color?: number;
    intensity?: number;
}
@DBManager.registerElementDB(AmbientLightDB)
export class AmbientLightElement extends AbstractUniqueGraphicElement<AmbientLightDB, IAmbientLightParams, IAmbientLightParams> {
    protected async _createDB(args: IAmbientLightParams): Promise<void> {
        await this._updateDB(args);
    }

    protected async _updateDB(args: IAmbientLightParams): Promise<void> {
        const { color, intensity } = args;
        if (color) this.db.color = color;
        if (intensity) this.db.intensity = intensity;
    }
}
