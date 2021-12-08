/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode, useState, useCallback } from 'react';
import { MDXProvider } from '@mdx-js/react';

import Layout from '@theme/Layout';
import type { DocumentRoute } from '@theme/DocItem';
import DocSidebar from '@theme/DocSidebar';
import MDXComponents from '@theme/MDXComponents';
import IconArrow from '@theme/IconArrow';
import BackToTopButton from '@theme/BackToTopButton';
import { translate } from '@docusaurus/Translate';

import clsx from 'clsx';
import styles from './styles.module.css';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { ReactComponentMetadata } from '../../metadata';

export type ReactDocLayoutProps = {
    readonly children: ReactNode;
    readonly componentMetadata: ReactComponentMetadata;
    readonly currentRoute: Omit<DocumentRoute, 'exact'>;
};

function ReactDocLayout({
    componentMetadata,
    currentRoute,
    children,
}: ReactDocLayoutProps): JSX.Element {
    const sidebar = componentMetadata.apiSidebars[currentRoute.sidebar];
    const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
    const [hiddenSidebar, setHiddenSidebar] = useState(false);
    const toggleSidebar = useCallback(() => {
        if (hiddenSidebar) {
            setHiddenSidebar(false);
        }

        setHiddenSidebarContainer(value => !value);
    }, [hiddenSidebar]);

    return (
        <Layout
            wrapperClassName={ThemeClassNames.wrapper.docsPages}
            pageClassName={ThemeClassNames.page.docsDocPage}>
            <div className={styles.docPage}>
                <BackToTopButton />

                <aside
                    className={clsx(styles.docSidebarContainer, {
                        [styles.docSidebarContainerHidden]: hiddenSidebarContainer,
                    })}
                    onTransitionEnd={e => {
                        if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
                            return;
                        }

                        if (hiddenSidebarContainer) {
                            setHiddenSidebar(true);
                        }
                    }}>
                    <DocSidebar
                        key={
                            // Reset sidebar state on sidebar changes
                            // See https://github.com/facebook/docusaurus/issues/3414
                            currentRoute.sidebar
                        }
                        sidebar={sidebar}
                        path={currentRoute.path}
                        onCollapse={toggleSidebar}
                        isHidden={hiddenSidebar}
                    />

                    {hiddenSidebar && (
                        <div
                            className={styles.collapsedDocSidebar}
                            title={translate({
                                id: 'theme.docs.sidebar.expandButtonTitle',
                                message: 'Expand sidebar',
                                description:
                                    'The ARIA label and title attribute for expand button of doc sidebar',
                            })}
                            aria-label={translate({
                                id: 'theme.docs.sidebar.expandButtonAriaLabel',
                                message: 'Expand sidebar',
                                description:
                                    'The ARIA label and title attribute for expand button of doc sidebar',
                            })}
                            tabIndex={0}
                            role="button"
                            onKeyDown={toggleSidebar}
                            onClick={toggleSidebar}>
                            <IconArrow className={styles.expandSidebarButtonIcon} />
                        </div>
                    )}
                </aside>
                <main
                    className={clsx(styles.docMainContainer, {
                        [styles.docMainContainerEnhanced]: hiddenSidebarContainer || !sidebar,
                    })}>
                    <div
                        className={clsx(
                            'container padding-top--md padding-bottom--lg',
                            styles.docItemWrapper,
                            {
                                [styles.docItemWrapperEnhanced]: hiddenSidebarContainer,
                            }
                        )}>
                        <MDXProvider components={MDXComponents}>{children}</MDXProvider>
                    </div>
                </main>
            </div>
        </Layout>
    );
}

export default ReactDocLayout;
