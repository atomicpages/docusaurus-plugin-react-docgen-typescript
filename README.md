# Docusaurus Plugin `react-docgen-typescript`

A Docusaurus 2.x plugin that help generate and consume auto-generated docs from `react-docgen-typescript`.

## Installation

Grab from NPM and install along with `react-docgen-typescript`:

```sh
npm i docusaurus-plugin-react-docgen-typescript react-docgen-typescript # or
yarn add docusaurus-plugin-react-docgen-typescript react-docgen-typescript
```

## Usage

Inside your `docusaurus.config.js` add to the `plugins` field and configure with the `src` option with full glob support :+1:.

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

Any pattern supported by [`fast-glob`](https://github.com/mrmlnc/fast-glob) is allowed here (including negations).

## Options

| Name              | Type                                                                               | Required | Description                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`             | `string` \| `string[]`                                                             | Yes      | Tell `react-docgen` where to look for source files.                                                                                                        |
| `global`          | `boolean`                                                                          | No       | Store results so they're [globally accessible](https://v2.docusaurus.io/docs/docusaurus-core#useplugindatapluginname-string-pluginid-string) in docusaurus |
| `route`           | [`RouteConfig`](https://v2.docusaurus.io/docs/lifecycle-apis#actions)              | No       | Makes docgen results accessible at the specified URL. Note `modules` cannot be overridden.                                                                 |
| `tsConfig`        | `string`                                                                           | No       | Specify the path to your custom tsconfig file (note that in most cases the default config is sufficient)                                                   |
| `compilerOptions` | `CompilerOptions`                                                                  | No       | Pass custom ts compiler options in lieu of of a custom `tsConfig`                                                                                          |
| `parserOptions`   | [`ParserOptions`](https://github.com/styleguidist/react-docgen-typescript#options) | No       | Options passed to `react-docgen-typescript`                                                                                                                |
