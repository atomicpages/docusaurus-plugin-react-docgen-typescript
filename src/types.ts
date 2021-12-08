declare module '@theme/ReactComponentPage' {
    const ReactComponentPage: (
        props: import('./theme/ReactComponentPage').ReactComponentPageProps
    ) => JSX.Element | null;
    export default ReactComponentPage;
}

declare module '@theme/ReactComponentItem' {
    const ReactComponentItem: (
        props: import('./theme/ReactComponentItem').ReactComponentItemProps
    ) => JSX.Element | null;
    export default ReactComponentItem;
}

declare module '@theme/ReactDocLayout' {
    const ReactDocLayout: (
        props: import('./theme/ReactDocLayout').ReactDocLayoutProps
    ) => JSX.Element | null;
    export default ReactDocLayout;
}

declare module '@theme/ReactPropTable' {
    const ReactPropTable: (
        props: import('./theme/ReactPropTable').ReactPropTableProps
    ) => JSX.Element | null;
    export default ReactPropTable;
}
