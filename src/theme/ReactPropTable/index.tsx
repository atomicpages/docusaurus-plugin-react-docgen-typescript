import React from 'react';
import { Props } from 'react-docgen-typescript';

export type ReactPropTableProps = {
    data: Props;
};

export default function ReactPropTable({ data }: ReactPropTableProps): JSX.Element {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Default value</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(data).map(key => {
                    const prop = data[key];

                    return (
                        <tr key={key}>
                            <td>
                                <code>{key}</code>
                            </td>
                            <td>
                                <code>{prop.type?.name}</code>
                            </td>
                            <td>{prop.defaultValue && <code>{prop.defaultValue.value}</code>}</td>
                            <td>{prop.required ? 'Yes' : 'No'}</td>
                            <td>{prop.description}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
