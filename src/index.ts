import globby from 'globby';
import docgen, { ParserOptions, ComponentDoc, FileParser } from 'react-docgen-typescript';

import { Plugin, DocusaurusContext, RouteConfig } from '@docusaurus/types';
import { CompilerOptions } from 'typescript';

type Route = Pick<RouteConfig, 'exact' | 'component' | 'path' | 'priority'>;

type Union =
    | {
          global?: undefined | false;
          route: Route;
      }
    | {
          global: boolean;
          route?: Route;
      };

type Options = Union & {
    src: string | string[];
    tsConfig?: string;
    compilerOptions?: CompilerOptions;
    parserOptions?: ParserOptions;
};

const getParser = (
    config?: Options['tsConfig'],
    options?: Options['compilerOptions'],
    parserOptions?: Options['parserOptions']
): FileParser['parse'] => {
    if (config) {
        return docgen.withCustomConfig(config, parserOptions).parse;
    } else if (options) {
        return docgen.withCompilerOptions(options, parserOptions).parse;
    }

    return docgen.withDefaultConfig(parserOptions).parse;
};

export default function plugin(
    context: DocusaurusContext,
    { src, global = false, route, tsConfig, compilerOptions, parserOptions }: Options
): Plugin<ComponentDoc[]> {
    return {
        name: 'docusaurus-plugin-react-docgen-typescript',
        async loadContent() {
            return getParser(tsConfig, compilerOptions, parserOptions)(await globby(src));
        },
        async contentLoaded({ content, actions }): Promise<void> {
            const { createData, setGlobalData, addRoute } = actions;

            if (global) {
                console.warn(
                    'Using global data can potentially slow down your entire app. Use with care ❤️'
                );

                setGlobalData(content);
            } else if (route) {
                addRoute({
                    ...route,
                    modules: {
                        docgen: await createData('docgen.json', JSON.stringify(content)),
                    },
                });
            } else {
                content.map(component =>
                    createData(`${component.displayName}.json`, JSON.stringify(component.props))
                );
            }
        },
    };
}
