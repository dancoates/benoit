import React, {FunctionComponent} from 'react';
// @ts-ignore
import {LoadingBoundary} from 'react-enty';

type Props = {
    message: object
};

const Loader: FunctionComponent<Props> = (props) => {
    const {message, children} = props;
    return <LoadingBoundary
        fallback={() => <div>Loading...</div>}
        error={() => <div>Error!</div>}
        message={message}
        children={children}
    />;
};

export default Loader;