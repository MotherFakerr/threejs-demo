import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less';
import { View } from './view';

function start(): void {
    const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(<View />);
}
start();
