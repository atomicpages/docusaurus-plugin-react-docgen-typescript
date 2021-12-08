import React from 'react';

import type { Props } from '@theme/DocPage';
import { ComponentDoc } from 'react-docgen-typescript';
import ReactPropTable from '@theme/ReactPropTable';

export type ReactComponentItemProps = Omit<Props, 'versionMetadata'> & {
    data: ComponentDoc;
};

export default function ReactComponentItem(props: ReactComponentItemProps): JSX.Element {
    const { data } = props;

    return (
        <>
            <h2>{data.displayName}</h2>
            <p>{data.description}</p>
            <h3>Props</h3>
            <ReactPropTable data={data.props} />
        </>
    );
}
