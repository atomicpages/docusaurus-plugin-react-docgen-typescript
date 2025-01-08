/* eslint-disable @typescript-eslint/unbound-method */
import path from "node:path";

import type {
  ParserOptions,
  ComponentDoc,
  FileParser,
} from "react-docgen-typescript";
import {
  withCustomConfig,
  withCompilerOptions,
  withDefaultConfig,
} from "react-docgen-typescript";

import type { Plugin, DocusaurusContext, RouteConfig } from "@docusaurus/types";
import { glob } from "glob";
import type { CompilerOptions } from "typescript";

type Route = Pick<RouteConfig, "exact" | "component" | "path" | "priority">;

type Union =
  | {
      global?: undefined | false;
      route: Route;
    }
  | {
      global: boolean;
      route?: Route;
    };

export type Options = Union & {
  src: string | string[];
  ignore?: string[];
  tsConfig?: string;
  compilerOptions?: CompilerOptions;
  parserOptions?: ParserOptions;
  globOptions: null;
};

function getParser(
  config?: Options["tsConfig"],
  options?: Options["compilerOptions"],
  parserOptions?: Options["parserOptions"],
): FileParser["parse"] {
  if (config) {
    return withCustomConfig(config, parserOptions ?? {}).parse;
  } else if (options) {
    return withCompilerOptions(options, parserOptions).parse;
  }

  return withDefaultConfig(parserOptions).parse;
}

export default function plugin(
  context: DocusaurusContext,
  {
    src,
    ignore,
    global = false,
    route,
    tsConfig,
    compilerOptions,
    parserOptions,
  }: Options,
): Plugin<ComponentDoc[]> {
  return {
    name: "docusaurus-plugin-react-docgen-typescript",
    async loadContent() {
      return getParser(
        tsConfig,
        compilerOptions,
        parserOptions,
      )(
        await glob(src, {
          absolute: true,
          ignore,
        }),
      );
    },
    configureWebpack(config) {
      return {
        resolve: {
          alias: {
            "@docgen": path.join(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
              (config.resolve!.alias as any)["@generated"],
              "docusaurus-plugin-react-docgen-typescript",
              "default",
            ),
          },
        },
      };
    },
    async contentLoaded({ content, actions }): Promise<void> {
      const { createData, setGlobalData, addRoute } = actions;

      if (global) {
        console.warn(
          "Using global data can potentially slow down your entire app. Use with care ❤️",
        );

        setGlobalData(content);
      } else if (route) {
        addRoute({
          ...route,
          modules: {
            docgen: await createData("docgen.json", JSON.stringify(content)),
          },
        });
      } else {
        const toProcess = content.reduce<
          [
            Record<string, string[]>,
            { fileName: string; component: ComponentDoc }[],
          ]
        >(
          ([processed, components], component) => {
            const componentName = component.displayName;
            let fileName = componentName;
            const alreadyProcessed = processed[componentName];
            if (alreadyProcessed && alreadyProcessed.length > 0) {
              console.warn(
                `Duplicate component '${componentName}' found (existing:
                ${alreadyProcessed[alreadyProcessed.length - 1]})`,
              );

              fileName += `${alreadyProcessed.length}`;
              console.warn(
                `'${component.filePath}' will be written to '${fileName}.json'`,
              );
            }
            return [
              {
                ...processed,
                [componentName]: [
                  ...(alreadyProcessed || []),
                  component.filePath,
                ],
              },
              [...components, { fileName, component }],
            ];
          },
          [{}, []],
        );
        toProcess[1].forEach(({ fileName, component }) => {
          void createData(`${fileName}.json`, JSON.stringify(component.props));
        });
      }
    },
  };
}
