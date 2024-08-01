import { AnimationMixer } from '../animation';

export class AnimationMixerMgr {
    private _animationMixers = new Map<number, AnimationMixer>();

    public getAllAnimationMixers(): AnimationMixer[] {
        return [...this._animationMixers.values()];
    }

    public addAnimationMixer(...animationMixers: AnimationMixer[]): void {
        for (const animationMixer of animationMixers) {
            const id = animationMixer.id.toNum();
            this._animationMixers.set(id, animationMixer);
        }
    }

    public getAnimationMixerById(id: number): AnimationMixer | undefined {
        return this._animationMixers.get(id);
    }

    public getAnimationMixersByIds(...ids: number[]): AnimationMixer[] {
        const res = [];
        for (const id of ids) {
            const animationMixer = this._animationMixers.get(id);
            if (animationMixer) {
                res.push(animationMixer);
            }
        }

        return res;
    }

    public delAnimationMixersByIds(...ids: number[]): void {
        for (const id of ids) {
            this._animationMixers.delete(id);
        }
    }
}
