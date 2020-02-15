import React, {FunctionComponent} from 'react';
import SplitPane from 'react-split-pane';

interface Props {
    minSize?: number,
    maxSize?: number,
    defaultSize?: number
}

const HorizontalSplit: FunctionComponent<Props> = (props) => {
    return <SplitPane
        {...props}
        split="horizontal"
        resizerStyle={{
            background: '#000',
            opacity: 0.2,
            zIndex: 1,
            boxSizing: 'border-box',
            backgroundClip: 'padding-box',
            height: '11px',
            margin: '-5px 0',
            borderTop: '5px solid rgba(255, 255, 255, 0)',
            borderBottom: '5px solid rgba(255, 255, 255, 0)',
            cursor: 'row-resize',
            width: '100%'
        }}
    >
        {props.children}
    </SplitPane>;
}

export default HorizontalSplit;