import path from "path";
import { promisify } from "util";
import Glob from "glob";

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
import type { CompilerOptions } from "typescript";

const glob = promisify(Glob);

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
  tsConfig?: string;
  compilerOptions?: CompilerOptions;
  parserOptions?: ParserOptions;
  globOptions: null;
};

const getParser = (
  config?: Options["tsConfig"],
  options?: Options["compilerOptions"],
  parserOptions?: Options["parserOptions"]
): FileParser["parse"] => {
  if (config) {
    return withCustomConfig(config, parserOptions).parse;
  } else if (options) {
    return withCompilerOptions(options, parserOptions).parse;
  }

  return withDefaultConfig(parserOptions).parse;
};

export default function plugin(
  context: DocusaurusContext,
  {
    src,
    global = false,
    route,
    tsConfig,
    compilerOptions,
    parserOptions,
  }: Options
): Plugin<ComponentDoc[]> {
  return {
    name: "docusaurus-plugin-react-docgen-typescript",
    async loadContent() {
      return getParser(
        tsConfig,
        compilerOptions,
        parserOptions
      )(
        await glob(Array.isArray(src) ? src.join(",") : src, {
          absolute: true,
        })
      );
    },
    configureWebpack(config) {
      return {
        resolve: {
          alias: {
            "@docgen": path.join(
              config.resolve.alias["@generated"],
              "docusaurus-plugin-react-docgen-typescript",
              "default"
            ),
          },
        },
      };
    },
    async contentLoaded({ content, actions }): Promise<void> {
      const { createData, setGlobalData, addRoute } = actions;

      if (global) {
        console.warn(
          "Using global data can potentially slow down your entire app. Use with care ❤️"
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
        const processed = {};
        content.map((component) => {
          const componentName = component.displayName;
          let fileName = componentName;
          if (componentName in processed) {
            console.warn(
              `Duplicate component '${componentName}' found (existing:
                ${
                  processed[componentName][processed[componentName].length - 1]
                })`
            );

            fileName += `${processed[componentName].length}`;
            console.warn(
              `'${component.filePath}' will be written to '${fileName}.json'`
            );
          }
          createData(`${fileName}.json`, JSON.stringify(component.props));
          if (!(componentName in processed)) {
            processed[componentName] = [];
          }
          processed[componentName].push(component.filePath);
        });
      }
    },
  };
}
