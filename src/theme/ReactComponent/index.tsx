import React from 'react';
import { ComponentDoc } from 'react-docgen-typescript';
import PropTable from '@theme/ReactPropTable';

export type ReactComponentProps = {
    data: ComponentDoc;
};

export default function ReactComponent({ data }: ReactComponentProps): JSX.Element {
    return (
        <>
            <h2>{data.displayName}</h2>
            <p>{data.description}</p>
            <PropTable data={data.props}></PropTable>
        </>
    );
}
