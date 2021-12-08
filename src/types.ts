declare module '@theme/ReactComponentList' {
    const ReactComponentList: (
        props: import('./theme/ReactComponentList').ReactComponentListProps
    ) => JSX.Element | null;
    export default ReactComponentList;
}

declare module '@theme/ReactComponent' {
    const ReactComponent: (
        props: import('./theme/ReactComponent').ReactComponentProps
    ) => JSX.Element | null;
    export default ReactComponent;
}

declare module '@theme/ReactPropTable' {
    const ReactPropTable: (
        props: import('./theme/ReactPropTable').ReactPropTableProps
    ) => JSX.Element | null;
    export default ReactPropTable;
}
