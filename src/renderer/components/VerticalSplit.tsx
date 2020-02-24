import React, {FunctionComponent} from 'react';
import SplitterLayout from 'react-splitter-layout';

interface Props {
    minSize?: number,
    maxSize?: number,
    defaultSize?: number
}

const HorizontalSplit: FunctionComponent<Props> = (props) => {
    return <SplitterLayout
        {...props}
        percentage={true}
    >
        {props.children}
    </SplitterLayout>;
}

export default HorizontalSplit;