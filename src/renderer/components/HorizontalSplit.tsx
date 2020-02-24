import React, {FunctionComponent} from 'react';
import SplitterLayout from 'react-splitter-layout';

interface Props {
    primaryMinSize?: number,
    secondaryMinSize?: number,
    secondaryInitialSize?: number
}

const HorizontalSplit: FunctionComponent<Props> = (props) => {
    return <SplitterLayout
        {...props}
        vertical={true}
        percentage={true}
    >
        {props.children}
    </SplitterLayout>;
}

export default HorizontalSplit;