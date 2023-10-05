import { IRenderer } from '../renderer/interface';
import { ThreeRenderer } from '../renderer/three_renderer';
import { ISysView, ISysViewOptions } from './interface';

export class SysView implements ISysView {
    private _renderer: IRenderer;

    constructor(private _container: HTMLElement, options?: ISysViewOptions) {
        const { autoResize } = options;
        this._renderer = new ThreeRenderer(this._container, options);

        if (autoResize) {
            const resizeObserver = new ResizeObserver(() => this.resize());
            resizeObserver.observe(this._container);
        }
    }

    public getRenderer(): IRenderer {
        return this._renderer;
    }

    public updateCamera(): void {
        this._renderer.getCamera().updateProjectionMatrix();
        this.updateView();
    }

    public updateView(): void {
        this._renderer.render();
    }

    public resize(): void {
        this._renderer.resize(this._container.clientWidth, this._container.clientHeight);
    }
}
