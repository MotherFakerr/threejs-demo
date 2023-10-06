import {
    AxesHelper,
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    Object3D,
    PointLight,
    PointLightHelper,
    Renderer,
    Scene,
    Vector3,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IRenderer, IThreeRenderOptions } from './interface';
import { PerspectiveCamera } from './camera/perspective_camera';
import { EN_CAMERA_TYPE, ICamera, OrthographicCamera } from './camera';
import { GeoElementMgr } from './geo_element_mgr';
import { AbstractGeoElement, IAbstractGeoElementInit } from '../geo_element/abstract_geo_element';
import { GElementClass } from '../geo_element/interface';
import { ElementIdPool } from '../id/id_pool';
import { ElementId } from '../id/element_id';

export class ThreeRenderer implements IRenderer {
    private readonly _geoElementMgr: GeoElementMgr;

    private readonly _idPool = new ElementIdPool();

    private _scene: Scene;

    private _camera: ICamera;

    private _renderer: Renderer;

    constructor(container: HTMLElement, options: IThreeRenderOptions) {
        this._geoElementMgr = new GeoElementMgr();
        this._scene = new Scene();
        this._initCamera(container, options);
        this._initRenderer(container);

        // temp code -------------
        const geometry = new BoxGeometry(50, 100, 20);
        const material = new MeshBasicMaterial({
            color: 0xff2288,
            transparent: true, // 开启透明
            opacity: 0.5,
        });

        const material1 = new MeshLambertMaterial({
            color: 0xff2288,
            transparent: true, // 开启透明
            opacity: 0.5,
        });

        const cube = new Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        const cube1 = new Mesh(geometry, material1);
        cube1.position.set(120, 0, 0);

        this._scene.add(cube, cube1);
        // this._scene.background = new Color(255, 255, 255);

        // tmp code end ------------------

        const { isDebug } = options;
        if (isDebug) {
            const axesHelper = new AxesHelper(150);
            this._scene.add(axesHelper);

            const controls = new OrbitControls(this._camera.getInstance(), container);
            // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
            controls.addEventListener('change', () => {
                this._renderer.render(this._scene, this._camera.getInstance()); // 执行渲染操作
            });
        }
    }

    public render(): void {
        this._renderer.render(this._scene, this._camera.getInstance());
    }

    public resize(width: number, height: number): void {
        this._renderer.setSize(width, height);
        this._camera.resize(width, height);
        this.render();
    }

    public getCamera(): ICamera {
        return this._camera;
    }

    public getScene(): Scene {
        return this._scene;
    }

    public createGeoElement<T extends AbstractGeoElement>(
        Ctor: GElementClass<T>,
        params: Omit<Parameters<T['create']>[0], keyof IAbstractGeoElementInit>,
    ): T {
        const element = new Ctor(this as IRenderer, this._idPool).create({ ...params });
        this._geoElementMgr.addElements(element);
        this._scene.add(...element.renderObjects);
        return element;
    }

    public getElementById(eleId: number | ElementId): AbstractGeoElement | undefined {
        const id = eleId instanceof ElementId ? eleId.toNum() : eleId;
        return this._geoElementMgr.getElementById(id);
    }

    public getElementsByIds(...eleIds: (number | ElementId)[]): AbstractGeoElement[] {
        const ids = eleIds.map((id) => (id instanceof ElementId ? id.toNum() : id));
        return this._geoElementMgr.getElementsByIds(...ids);
    }

    public delElementsByIds(...eleIds: (number | ElementId)[]): void {
        const ids = eleIds.map((id) => (id instanceof ElementId ? id.toNum() : id));
        const elements = this._geoElementMgr.getElementsByIds(...ids);
        this._scene.remove(
            ...elements.reduce((allEles, ele) => {
                allEles.push(...ele.renderObjects);
                return allEles;
            }, [] as Object3D[]),
        );
        this._geoElementMgr.delElementsByIds(...ids);
        this._idPool.recycleIds(...ids);
    }

    public getAllElements(): AbstractGeoElement[] {
        return this._geoElementMgr.getAllElements();
    }

    private _initCamera(
        container: HTMLElement,
        { cameraType = EN_CAMERA_TYPE.PRESPECTIVE, perspectiveCameraOptions, orthographicCameraOptions }: IThreeRenderOptions,
    ): void {
        if (cameraType === EN_CAMERA_TYPE.PRESPECTIVE) {
            const options = perspectiveCameraOptions ?? {
                fov: 75,
                aspect: container.clientWidth / container.clientHeight,
                near: 0.1,
                far: 1000,
            };

            this._camera = new PerspectiveCamera(options);
        } else {
            const options = orthographicCameraOptions ?? {
                left: -container.clientWidth / 2,
                right: container.clientWidth / 2,
                top: container.clientHeight / 2,
                bottom: -container.clientHeight / 2,
                near: 0.1,
                far: 1000,
            };
            this._camera = new OrthographicCamera(options);
        }

        this._camera.position.set(0, 0, 200);
        this._camera.lookAt(0, 0, 0);
    }

    private _initRenderer(container: HTMLElement): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this._renderer.domElement);
    }
}
