import path from 'path';
import globby from 'globby';
import docgen, { ParserOptions, ComponentDoc, FileParser } from 'react-docgen-typescript';
import { DEFAULT_PLUGIN_ID } from '@docusaurus/core/lib/constants';

import { Plugin, LoadContext, RouteConfig } from '@docusaurus/types';
import { docuHash } from '@docusaurus/utils';
import { CompilerOptions } from 'typescript';
import { PropSidebarItem } from '@docusaurus/plugin-content-docs-types';

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
    id: string;
    src: string | string[];
    tsConfig?: string;
    compilerOptions?: CompilerOptions;
    parserOptions?: ParserOptions;
    createRoutes?: boolean;
    baseRoute?: string;
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
    context: LoadContext,
    {
        id,
        src,
        global = false,
        route,
        tsConfig,
        compilerOptions,
        parserOptions,
        createRoutes,
        baseRoute = '/docs/react',
    }: Options
): Plugin<ComponentDoc[]> {
    const { generatedFilesDir } = context;

    const pluginId = id ?? DEFAULT_PLUGIN_ID;
    const pluginName = 'docusaurus-plugin-react-docgen-typescript';
    const pluginDataDirRoot = path.join(generatedFilesDir, pluginName);

    const dataDir = path.join(pluginDataDirRoot, pluginId);

    return {
        name: pluginName,
        async loadContent() {
            return getParser(tsConfig, compilerOptions, parserOptions)(await globby(src));
        },
        configureWebpack() {
            return {
                resolve: {
                    alias: {
                        '@docgen': dataDir,
                    },
                },
            };
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
                const sidebarName = `react-docgen-typescript-sidebar-${pluginId}`;
                const sidebar: PropSidebarItem[] = content.map(component => ({
                    type: 'link',
                    href: `${baseRoute}/${component.displayName}`,
                    label: component.displayName,
                }));

                const componentMetadataPath = await createData(
                    `${docuHash('component-metadata-prop')}.json`,
                    JSON.stringify(
                        {
                            apiSidebars: {
                                [sidebarName]: sidebar,
                            },
                        },
                        null,
                        2
                    )
                );

                const routes: RouteConfig[] = await Promise.all(
                    content.map(async component => {
                        const componentData = await createData(
                            `${component.displayName}.json`,
                            JSON.stringify(component)
                        );

                        if (createRoutes) {
                            return {
                                path: `${baseRoute}/${component.displayName}`,
                                exact: true,
                                component: '@theme/ReactComponentItem',
                                sidebar: sidebarName,
                                modules: {
                                    componentMetadata: componentMetadataPath,
                                    data: componentData,
                                },
                            };
                        }
                    })
                );

                if (createRoutes) {
                    addRoute({
                        path: baseRoute,
                        component: '@theme/ReactComponentPage',
                        sidebar: sidebarName,
                        routes,
                        modules: {
                            componentMetadata: componentMetadataPath,
                        },
                    });
                }
            }
        },
        getThemePath(): string {
            return path.resolve(__dirname, './theme');
        },
    };
}
