import { EN_CAMERA_TYPE } from '../renderer';
import { ISysView, ISysViewOptions, SysView } from '../sys_view';
import { ISysApp } from './interface';

export class SysAppImpl implements ISysApp {
    private _viewMap = new Map<string, ISysView>();

    public initApp(): void {
        //
    }

    public getViewById(id: string): ISysView | undefined {
        if (this._viewMap.has(id)) {
            return this._viewMap.get(id);
        }
        console.error(`viewId ${id}不存在`);
        return undefined;
    }

    public createView(id: string, container: HTMLElement, options: ISysViewOptions = { autoResize: true }): ISysView {
        const view = new SysView(container, options);
        this._viewMap.set(id, view);
        return view;
    }

    public delViewById(id: string): void {
        if (this._viewMap.has(id)) {
            this._viewMap.delete(id);
            return;
        }

        console.error(`viewId ${id}不存在`);
    }
}

export const SysApp = new SysAppImpl();
