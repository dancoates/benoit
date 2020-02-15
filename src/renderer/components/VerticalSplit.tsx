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
        split="vertical"
        resizerStyle={{
            background: '#000',
            opacity: 0.2,
            zIndex: 1,
            boxSizing: 'border-box',
            backgroundClip: 'padding-box',
            width: '11px',
            margin: '0 -5px',
            borderLeft: '5px solid rgba(255, 255, 255, 0)',
            borderRight: '5px solid rgba(255, 255, 255, 0)',
            cursor: 'col-resize',
            height: '100%'
        }}
    >
        {props.children}
    </SplitPane>;
}

export default HorizontalSplit;