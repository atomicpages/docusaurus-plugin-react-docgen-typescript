#!/usr/bin/env node

const esbuild = require('esbuild');
const cssModules = require('esbuild-css-modules-plugin');

const format = process.env.FORMAT;

esbuild.build({
    logLevel: 'info',
    sourcemap: true,
    bundle: false,
    outbase: 'src',
    format: format,
    outdir: format === 'esm' ? 'pkg/dist-src' : 'pkg/dist-node',
    platform: 'node',
    plugins: [cssModules()],
    entryPoints: [
        'src/index.ts',
        'src/hooks/useDynamicImport.ts',
        'src/theme/ReactDocLayout/index.tsx',
        'src/theme/ReactDocLayout/styles.module.css',
        'src/theme/ReactComponentPage/index.tsx',
        'src/theme/ReactComponentItem/index.tsx',
        'src/theme/ReactPropTable/index.tsx',
    ],
});
