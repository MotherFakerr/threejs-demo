import { BoxGeometry, Mesh, MeshBasicMaterial, Renderer, Scene, WebGLRenderer } from 'three';
import { IRenderer } from './interface';
import { PerspectiveCamera } from './camera/perspective_camera';
import { AbstractCamera } from './camera';

export class ThreeRenderer implements IRenderer {
    private _scene: Scene;

    private _camera: AbstractCamera;

    private _renderer: Renderer;

    constructor(container: HTMLElement) {
        this._scene = new Scene();
        this._camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this._renderer = new WebGLRenderer();
        this._renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this._renderer.domElement);

        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0xff2288 });
        const cube = new Mesh(geometry, material);

        this._scene.add(cube);
    }

    public render(): void {
        this._renderer.render(this._scene, this._camera.getInstance());
    }

    public resize(width: number, height: number): void {
        this._renderer.setSize(width, height);
        this._camera.resize(width, height);
        this.render();
    }
}
