import { useEffect, useState } from "react";

export const useDynamicImport = <T extends Record<string, any> = any>(
  name: string,
): T => {
  const [props, setProps] = useState<T>({} as T);

  useEffect(() => {
    let resolved = false;

    import(`@docgen/${name}.json`)
      .then((mod: { default: T }) => {
        if (!resolved) {
          resolved = true;
          setProps(mod.default);
        }
      })
      .catch(console.error);

    return () => {
      resolved = true;
    };
  }, [name]);

  return props;
};
