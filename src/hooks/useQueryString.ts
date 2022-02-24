import { useMemo } from 'react';

export const getParams = <T>(s: string): Partial<T> =>
  new Proxy(new URLSearchParams(s), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  }) as unknown as Partial<T>;

export const useQueryString = <T extends { [key: string]: string }>(
  search: string
): Partial<T> => useMemo(() => getParams<T>(search), [search]);
