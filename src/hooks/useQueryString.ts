import { useMemo } from 'react';

export const useQueryString = <T extends { [key: string]: string }>(
  search: string
): T => {
  const params = useMemo(
    () =>
      new Proxy(new URLSearchParams(search), {
        get: (searchParams, prop: string) => searchParams.get(prop),
      }),
    [search]
  );

  return params as unknown as T;
};
