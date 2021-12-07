# Docusaurus Plugin `react-docgen-typescript`

A Docusaurus 2.x plugin that help generate and consume auto-generated docs from
`react-docgen-typescript`.

## Installation

Grab from NPM and install along with `react-docgen-typescript`:

```sh
npm i docusaurus-plugin-react-docgen-typescript react-docgen-typescript # or
yarn add docusaurus-plugin-react-docgen-typescript react-docgen-typescript
```

## Usage

Inside your `docusaurus.config.js` add to the `plugins` field and configure with the `src` option
with full glob support :+1:.

```js
module.exports = {
    // ...
    plugins: [
        [
            'docusaurus-plugin-react-docgen-typescript',
            {
                // pass in a single string or an array of strings
                src: ['path/to/**/*.tsx', '!path/to/**/*test.*'],
                global: true,
                parserOptions: {
                    // pass parserOptions to react-docgen-typescript
                    // here is a good starting point which filters out all
                    // types from react
                    propFilter: (prop, component) => {
                        if (prop.parent) {
                            return !prop.parent.fileName.includes('@types/react');
                        }

                        return true;
                    },
                },
            },
        ],
    ],
};
```

Any pattern supported by [`fast-glob`](https://github.com/mrmlnc/fast-glob) is allowed here
(including negations).

## Generating Routes

By enabling `createRoutes` flag in the options, the following routes will be created:

-   `/docs/react`, listing all the components
-   `/docs/react/{ComponentDisplayName}`, rendering the component information (name, description,
    props)

You may also override the default interface by implementing the following components in your
`src/components` folder:

-   `<ReactComponentList />`
-   `<ReactComponent />`
-   `<PropTable />`

## Reading Annotations

Using the default settings, annotations are stored inside of the `.docusaurus` directory. The
`@docgen` alias is set to ensure stable access to these files.

### Build a Prop Table

Most of the time props will want to be shown as API information to a particular component. For
convenience, we can use a simple hook from this package to dynamically import `.json` files:

```jsx
import * as React from 'react';
import { useDynamicImport } from 'docusaurus-plugin-react-docgen-typescript/pkg/dist-src/hooks/useDynamicImport';

export const PropTable = ({ name }) => {
    const props = useDynamicImport(name);

    if (!props) {
        return null;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Default Value</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(props).map(key => {
                    return (
                        <tr key={key}>
                            <td>
                                <code>{key}</code>
                            </td>
                            <td>
                                <code>{props[key].type?.name}</code>
                            </td>
                            <td>
                                {props[key].defaultValue && (
                                    <code>{props[key].defaultValue.value}</code>
                                )}
                            </td>
                            <td>{props[key].required ? 'Yes' : 'No'}</td>
                            <td>{props[key].description}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
```

## Options

| Name              | Type                                                                               | Required | Description                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`             | `string` \| `string[]`                                                             | Yes      | Tell `react-docgen` where to look for source files.                                                                                                        |
| `global`          | `boolean`                                                                          | No       | Store results so they're [globally accessible](https://v2.docusaurus.io/docs/docusaurus-core#useplugindatapluginname-string-pluginid-string) in docusaurus |
| `route`           | [`RouteConfig`](https://v2.docusaurus.io/docs/lifecycle-apis#actions)              | No       | Makes docgen results accessible at the specified URL. Note `modules` cannot be overridden.                                                                 |
| `tsConfig`        | `string`                                                                           | No       | Specify the path to your custom tsconfig file (note that in most cases the default config is sufficient)                                                   |
| `compilerOptions` | `CompilerOptions`                                                                  | No       | Pass custom ts compiler options in lieu of of a custom `tsConfig`                                                                                          |
| `parserOptions`   | [`ParserOptions`](https://github.com/styleguidist/react-docgen-typescript#options) | No       | Options passed to `react-docgen-typescript`                                                                                                                |
