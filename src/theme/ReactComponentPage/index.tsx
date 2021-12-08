import React from 'react';
import { ComponentDoc } from 'react-docgen-typescript';
import renderRoutes from '@docusaurus/renderRoutes';
import type { Props } from '@theme/DocPage';
import ReactDocLayout from '@theme/ReactDocLayout';
import { ReactComponentMetadata } from '../../metadata';
import { matchPath, useLocation } from '@docusaurus/router';

export type ReactComponentPageProps = Omit<Props, 'versionMetadata'> & {
    componentMetadata: ReactComponentMetadata;
    data: ComponentDoc[];
};

export default function ReactComponentPage({
    componentMetadata,
    route: { routes: componentRoutes, ...route },
}: ReactComponentPageProps): JSX.Element {
    const location = useLocation();
    const currentRoute =
        componentRoutes.find(componentRoute => matchPath(location.pathname, componentRoute)) ||
        route;

    return (
        <ReactDocLayout componentMetadata={componentMetadata} currentRoute={currentRoute}>
            {renderRoutes(componentRoutes)}
        </ReactDocLayout>
    );
}
