import { useMemo } from 'react';

type SimpleQueryStringMap = {
  [key: string]: string;
};

export const getParams = <T extends SimpleQueryStringMap>(
  s: string
): Partial<T> =>
  new Proxy(new URLSearchParams(s), {
    get: (searchParams, prop: string) => searchParams.get(prop),
  }) as unknown as Partial<T>;

export const useQueryString = <T extends SimpleQueryStringMap>(
  search: string
): Partial<T> => useMemo(() => getParams<T>(search), [search]);
