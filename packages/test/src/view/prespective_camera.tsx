import React from 'react';
import { IPerspectiveCamera, IPerspectiveCameraOptions, ISysView } from '@threejs-demo/core';
import './prespective_camera.less';
import { Col, InputNumber, Row, Slider } from 'antd';

interface IProps {
    view: ISysView;
}
type IState = IPerspectiveCameraOptions;

export class PrespectiveCameraView extends React.Component<Partial<IProps>, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            fov: 75,
            aspect: 1,
            near: 0.1,
            far: 1000,
        };
    }

    public componentDidMount(): void {
        const renderer = this.props.view!.getRenderer();
        const { fov, aspect, near, far } = renderer.getCamera() as IPerspectiveCamera;
        this.setState({
            fov,
            aspect,
            near,
            far,
        });
    }

    public render(): React.ReactElement {
        const view = this.props.view!;
        const renderer = view.getRenderer();
        const camera = renderer.getCamera() as IPerspectiveCamera;
        const { fov, aspect, near, far } = this.state;
        return (
            <div className='prespective-cemera-view'>
                <Row>
                    <Col span={4}>fov</Col>
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={180}
                            style={{ margin: '0 16px' }}
                            step={1}
                            value={fov}
                            onChange={(e) => {
                                camera.fov = e ?? 0;
                                this.setState({ fov: e ?? 0 });
                                view.updateCamera();
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>aspect</Col>
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={180}
                            style={{ margin: '0 16px' }}
                            step={1}
                            value={aspect}
                            onChange={(e) => {
                                camera.aspect = e ?? 0;
                                this.setState({ aspect: e ?? 0 });
                                view.updateCamera();
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>near</Col>
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={100}
                            style={{ margin: '0 16px' }}
                            step={0.1}
                            value={near}
                            onChange={(e) => {
                                camera.near = e ?? 0;
                                this.setState({ near: e ?? 0 });
                                view.updateCamera();
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>far</Col>
                    <Col span={4}>
                        <InputNumber
                            min={0}
                            max={10000}
                            style={{ margin: '0 16px' }}
                            step={1}
                            value={far}
                            onChange={(e) => {
                                camera.far = e ?? 0;
                                this.setState({ far: e ?? 0 });
                                view.updateCamera();
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
