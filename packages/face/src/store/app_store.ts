import { ISysApp, ISysView, SysApp } from '@threejs-demo/core';
import { action, makeObservable, observable } from 'mobx';
import { registerStore } from '.';
import { AbstractStore } from './abstract_store';

export interface IAppStore {
    mainViewId: string;
    noViewId: string;
    initApp(container: HTMLElement): void;
    getMainView(): ISysView;
    createView(id: string, container: HTMLElement): ISysView;
    delViewById(id: string): void;
}

@registerStore('appStore')
export class AppStore extends AbstractStore implements IAppStore {
    public mainViewId = 'view3d';

    public noViewId = 'noView3d';

    private _mainView: ISysView;

    private _mainApp: ISysApp;

    constructor() {
        super();
        makeObservable(this, {
            mainViewId: observable,
            noViewId: observable,
            initApp: action.bound,
            getMainView: action.bound,
            createView: action.bound,
            delViewById: action.bound,
        });
    }

    public initApp(container: HTMLElement): void {
        this._mainApp = SysApp;
        this._mainApp.initApp();
        this._mainView = this.createView(this.mainViewId, container);
        this._mainView.updateView();
    }

    public getMainView(): ISysView {
        if (!this._mainView) {
            throw new Error('main view is not created');
        }

        return this._mainView;
    }

    public createView(id: string, container: HTMLElement): ISysView {
        return this._mainApp.createView(id, container);
    }

    public delViewById(id: string): void {
        this._mainApp.delViewById(id);
    }
}
