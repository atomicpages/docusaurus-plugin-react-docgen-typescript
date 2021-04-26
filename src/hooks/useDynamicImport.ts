import { useEffect, useState } from 'react';
import { Props } from 'react-docgen-typescript';

export const useDynamicImport = (name: string): Props => {
    const [props, setProps] = useState<Props>(null);

    useEffect(() => {
        let resolved = false;

        import(`@docgen/${name}.json`)
            .then(props => {
                if (!resolved) {
                    resolved = true;
                    setProps(props.default);
                }
            })
            .catch(console.error);

        return () => {
            resolved = true;
        };
    }, [name]);

    return props;
};
