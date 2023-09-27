import { BoxGeometry, Camera, Mesh, MeshBasicMaterial, PerspectiveCamera, Renderer, Scene, WebGLRenderer } from 'three';

export class ThreeRenderer {
    private _scene: Scene;

    private _camera: Camera;

    private _renderer: Renderer;

    constructor(private _container: HTMLElement) {
        this._scene = new Scene();
        this._camera = new PerspectiveCamera(75, this._container.offsetWidth / this._container.offsetHeight, 0.1, 1000);
        this._renderer = new WebGLRenderer();
        this._renderer.setSize(this._container.offsetWidth, this._container.offsetHeight);
        this._container.appendChild(this._renderer.domElement);

        const geometry = new BoxGeometry();
        const material = new MeshBasicMaterial({ color: 0xff2288 });
        const cube = new Mesh(geometry, material);
        this._camera.position.z = 5;
        this._scene.add(cube);
    }

    public updateView(): void {
        this._renderer.render(this._scene, this._camera);
    }
}
