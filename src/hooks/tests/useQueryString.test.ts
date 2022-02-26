import { useQueryString, getParams } from '../useQueryString';
import { renderHook } from '@testing-library/react-hooks';

describe('getParams', () => {
  it('Should return an proxy object with the expected keys and values', () => {
    const search = '?keyA=keyAValue&keyB=keyBValue';
    const params = getParams<{ keyA: string; keyB: string }>(search);

    expect(params.keyA).toEqual('keyAValue');
    expect(params.keyB).toEqual('keyBValue');

    // @ts-ignore
    expect(params.keyC).toEqual(null);
  });

  it('Should be able to handle empty values', () => {
    const search = '?keyA=&keyB=keyBValue';
    const params = getParams<{ keyA: string; keyB: string }>(search);

    expect(params.keyA).toEqual('');
    expect(params.keyB).toEqual('keyBValue');
  });

  it('Should return strings even when is a number', () => {
    const search = '?keyA=12345&keyB=keyBValue';
    const params = getParams<{ keyA: string; keyB: string }>(search);

    expect(params.keyA).toEqual('12345');
    expect(params.keyB).toEqual('keyBValue');
  });
});

describe('useQueryString', () => {
  it('Should return the same data as getParams but memoized', () => {
    const search = '?keyA=12345&keyB=keyBValue';
    const { result } = renderHook(() => useQueryString(search));

    expect(result.current.keyA).toEqual('12345');
    expect(result.current.keyB).toEqual('keyBValue');
  });
});
