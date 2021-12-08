import React from 'react';
import { ComponentDoc } from 'react-docgen-typescript';

export type ReactComponentListProps = {
    baseRoute: string;
    data: ComponentDoc[];
};

export default function ReactComponentList({
    baseRoute,
    data,
}: ReactComponentListProps): JSX.Element {
    return (
        <>
            <h2>Components</h2>
            <ul>
                {data.map(component => (
                    <li key={component.displayName}>
                        <a href={`${baseRoute}/${component.displayName}`}>
                            {component.displayName}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
}
