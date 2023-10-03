import { ThreeRenderer } from '../renderer';
import { ISysView } from './interface';

export class SysView implements ISysView {
    private _renderer: ThreeRenderer;

    constructor(private _container: HTMLElement, autoResize = true, options = {}) {
        this._renderer = new ThreeRenderer(this._container, options);

        if (autoResize) {
            const resizeObserver = new ResizeObserver(() => this.resize());
            resizeObserver.observe(this._container);
        }
    }

    public updateView(): void {
        this._renderer.render();
    }

    public resize(): void {
        this._renderer.resize(this._container.clientWidth, this._container.clientHeight);
    }
}
