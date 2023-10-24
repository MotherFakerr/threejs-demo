import { ISysView } from '@threejs-demo/core';
import { action, makeObservable, observable } from 'mobx';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';
import { AmbientLightElement } from '@threejs-demo/elements';
import { registerStore } from '.';

export interface IDebuggerStore {
    gui: GUI;
    view: ISysView;
    init(dom: HTMLElement, view: ISysView): void;
    reset(): void;
}

@registerStore('debuggerStore')
export class DebuggerStore implements IDebuggerStore {
    gui = new GUI();

    view: ISysView;

    constructor() {
        makeObservable(this, {
            gui: observable,
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
        this.gui.add(ambientLight, 'intensity', 0, 2.0).onChange((v) => {
            ambientLight.update({ intensity: v });
        });
    }
}
