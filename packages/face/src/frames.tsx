import React from 'react';
import { ISysView } from '@threejs-demo/core';
import './frames.less';

interface IProps {
    view: ISysView;
}
interface IState {
    frames: number;
}

const FRAMES_INTERVAL = 1000;

export class FramesView extends React.Component<Partial<IProps>, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            frames: 0,
        };
    }

    public componentDidMount(): void {
        setInterval(() => {
            const { view } = this.props;
            if (!view) {
                return;
            }

            const frames = view.getRenderer().getFrames();
            this.setState({ frames });
        }, FRAMES_INTERVAL);
    }

    public render(): React.ReactElement {
        const { frames } = this.state;
        return <div className='frames'>{frames}</div>;
    }
}
