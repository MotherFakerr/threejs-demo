import { ISysView } from '@threejs-demo/core';
import { action, makeObservable, observable } from 'mobx';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';
import { AmbientLightElement } from '@threejs-demo/elements';

export interface IDebuggerStore {
    gui: GUI;
    view: ISysView;
    init(dom: HTMLElement, view: ISysView): void;
    reset(): void;
}

export class DebuggerStore implements IDebuggerStore {
    gui = new GUI();

    view: ISysView;

    constructor() {
        makeObservable(this, {
            gui: observable,
            view: observable,
            init: action.bound,
            reset: action.bound,
        });
    }

    init(dom: HTMLElement, view: ISysView): void {
        this.gui.domElement = dom;
        this.view = view;
        this.reset();
    }

    reset(): void {
        this._setAmbientDebug();
    }

    private _setAmbientDebug(): void {
        const ambientLight = this.view.getDocument().getOrCreateUniqueElement(AmbientLightElement);
    }
}
