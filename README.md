# Docusaurus Plugin `react-docgen-typescript`

A Docusaurus 2.x plugin that help generate and consume auto-generated docs from
`react-docgen-typescript`.

## Installation

Grab from NPM and install along with `react-docgen-typescript`:

```sh
npm i --save-dev docusaurus-plugin-react-docgen-typescript react-docgen-typescript
```

## Usage

Inside your `docusaurus.config.js` add to the `plugins` field and configure with
the `src` option with full glob support :+1:.

```js
module.exports = {
  // ...
  plugins: [
    [
      "docusaurus-plugin-react-docgen-typescript",
      /** @type {import('docusaurus-plugin-react-docgen-typescript').Options} */
      {
        // pass in a single string or an array of strings
        src: ["path/to/**/*.tsx"],
        ignore: ["path/to/**/*test.*"],
        parserOptions: {
          // pass parserOptions to react-docgen-typescript
          // here is a good starting point which filters out all
          // types from react
          propFilter: (prop, component) => {
            if (prop.parent) {
              return !prop.parent.fileName.includes("@types/react");
            }

            return true;
          },
        },
      },
    ],
  ],
};
```

Any pattern supported by [`fast-glob`](https://github.com/mrmlnc/fast-glob) is
allowed here (including negations).

`src` paths are relative to the location of your `docusaurus.config.js`. For
example, if you had a directory structure like:

```
.
├── LICENSE
├── README.md
├── package.json
├── src
...
├── website
│   ├── README.md
│   ├── babel.config.js
│   ├── blog
│   ├── docs
│   ├── docusaurus.config.js
|   ...
│   ├── src
│   └── yarn.lock
└── yarn.lock
```

Then to document all of your JSX components in your `src/` directory, you would
use this path: `../src/**/*.jsx`.

## Reading Annotations

Using the default settings, annotations are stored inside of the `.docusaurus`
directory. The `@docgen` alias is set to ensure stable access to these files.

### Build a Prop Table

Most of the time props will want to be shown as API information to a particular
component. For convenience, we can use a simple hook from this package to
dynamically import `.json` files:

```tsx
import { useDynamicImport } from "docusaurus-plugin-react-docgen-typescript/useDynamicImport";

type MyProps = {
  /* ... */
};

export const PropTable = ({ name }) => {
  const props = useDynamicImport<MyProps>(name);

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
        {Object.keys(props).map((key) => {
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
              <td>{props[key].required ? "Yes" : "No"}</td>
              <td>{props[key].description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
```

**N.b.** If you use `global: true`, then you must use the
[`useGlobalData` hook](https://docusaurus.io/docs/docusaurus-core#useGlobalData)
to access the docgen data. You cannot use `useDynamicImport`.

## Options

| Name              | Type                                                                               | Required | Description                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`             | `string` \| `string[]`                                                             | Yes      | Tell `react-docgen` where to look for source files.                                                                                                        |
| `global`          | `boolean`                                                                          | No       | Store results so they're [globally accessible](https://v2.docusaurus.io/docs/docusaurus-core#useplugindatapluginname-string-pluginid-string) in docusaurus |
| `route`           | [`RouteConfig`](https://v2.docusaurus.io/docs/lifecycle-apis#actions)              | No       | Makes docgen results accessible at the specified URL. Note `modules` cannot be overridden.                                                                 |
| `tsConfig`        | `string`                                                                           | No       | Specify the path to your custom tsconfig file (note that in most cases the default config is sufficient)                                                   |
| `compilerOptions` | `CompilerOptions`                                                                  | No       | Pass custom ts compiler options in lieu of of a custom `tsConfig`                                                                                          |
| `parserOptions`   | [`ParserOptions`](https://github.com/styleguidist/react-docgen-typescript#options) | No       | Options passed to `react-docgen-typescript`                                                                                                                |
