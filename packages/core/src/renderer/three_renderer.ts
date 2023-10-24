import {
    AnimationMixer,
    AxesHelper,
    BoxGeometry,
    Clock,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    Object3D,
    Renderer,
    Scene,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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

    private _stats: Stats | undefined;

    private _animationMixer: AnimationMixer;

    private _clock: Clock;

    constructor(private _container: HTMLElement, private _options: IThreeRenderOptions) {
        this._geoElementMgr = new GeoElementMgr();
        this._scene = new Scene();
        this._initCamera(_container, _options);
        this._initRenderer(_container);

        // temp code -------------
        const geometry = new BoxGeometry(50, 100, 20);
        const material = new MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true, // 开启透明
            opacity: 0.5,
        });

        const material1 = new MeshLambertMaterial({
            color: 0x00ffff,
            transparent: true, // 开启透明
            opacity: 0.5,
        });

        const cube = new Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        const cube1 = new Mesh(geometry, material1);
        cube1.position.set(120, 0, 0);

        // this._scene.add(cube, cube1);
        this._scene.background = null;

        // tmp code end ------------------

        const { isDebug, showFrameStats, isAnimate } = _options;
        if (isDebug) {
            const axesHelper = new AxesHelper(150);
            this._scene.add(axesHelper);

            const controls = new OrbitControls(this._camera.getInstance(), _container);
        }
        // const num = 100; // 控制长方体模型数量
        // const meshes: Mesh[] = [];
        // for (let i = 0; i < num; i++) {
        //     const geometry = new BoxGeometry(5, 5, 5);
        //     const material = new MeshLambertMaterial({
        //         color: 0x00ffff,
        //     });
        //     const mesh = new Mesh(geometry, material);
        //     // 随机生成长方体xyz坐标
        //     const x = (Math.random() - 0.5) * 2000;
        //     const y = (Math.random() - 0.5) * 2000;
        //     const z = (Math.random() - 0.5) * 2000;
        //     mesh.position.set(x, y, z);
        //     meshes.push(mesh);
        //     this._scene.add(mesh); // 模型对象插入场景中
        // }
        const loader = new GLTFLoader();
        loader.load('model/keli.gltf', (mmd) => {
            // called when the resource is loaded
            this._animationMixer = new AnimationMixer(mmd.scene);
            const clip = this._animationMixer.clipAction(mmd.animations[0]);
            this._scene.add(mmd.scene);
            clip.play();
        });
        // const loader1 = new FBXLoader();
        // loader1.load('大社.fbx', (mmd) => {
        //     // called when the resource is loaded
        //     debugger;
        //     // this._scene.add(mmd);
        // });
        this._clock = new Clock();

        if (isAnimate) {
            setInterval(() => {
                // this._test.rotateY(0.1);
            }, 10);
            this._requestAnimationFrame();
        }

        if (showFrameStats) {
            this._stats = new Stats();
            _container.appendChild(this._stats.dom);
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
        this._scene.add(element.renderObject);
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
                allEles.push(ele.renderObject);
                return allEles;
            }, [] as Object3D[]),
        );
        this._geoElementMgr.delElementsByIds(...ids);
        this._idPool.recycleIds(...ids);
    }

    public getAllElements(): AbstractGeoElement[] {
        return this._geoElementMgr.getAllElements();
    }

    public async onGeoElementUpdate(element: AbstractGeoElement): Promise<void> {
        const obj = element.renderObject.clone();
        this._scene.remove(element.renderObject);
        this._scene.add(obj);
    }

    private _requestAnimationFrame(): void {
        if (this._stats) {
            this._stats.update();
        }

        if (this._animationMixer) {
            this._animationMixer.update(this._clock.getDelta());
        }
        this.render();
        requestAnimationFrame(this._requestAnimationFrame.bind(this));
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

        this._camera.position.set(1, 1, 2);
        this._camera.lookAt(0, 0, 0);
    }

    private _initRenderer(container: HTMLElement): void {
        this._renderer = new WebGLRenderer({ alpha: true, antialias: true });
        this._renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this._renderer.domElement);
    }
}
