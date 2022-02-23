import { useMemo } from 'react';

export const getParams = <T>(s: string): T =>
  new Proxy(new URLSearchParams(s), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  }) as unknown as T;

export const useQueryString = <T extends { [key: string]: string }>(
  search: string
): T => useMemo(() => getParams<T>(search), [search]);
