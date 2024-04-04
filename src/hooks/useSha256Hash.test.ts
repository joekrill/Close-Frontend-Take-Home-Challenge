import { renderHook, waitFor } from '@testing-library/react';
import { useSha256Hash } from './useSha256Hash';

it.each([
  {
    input: 'myemailaddress@example.com',
    hash: '84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee',
  },
  {
    input: 'MyEmailAddress@example.com',
    hash: 'a949d2302bfac2923785f542162f91931d896c7dc34bb0ee773cda1713851347',
  },
  {
    input: '       MyEmailAddress@example.com     ',
    hash: '246be8eddb00332fc3a445695c0e286e937ab61006b4fc1bdd4b774dca979fc8',
  },
  {
    input: 'foobar',
    hash: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
  },
])("correctly hashes '$input'", async ({ input, hash }) => {
  const { result } = renderHook(() => useSha256Hash(input));
  await waitFor(() => expect(result.current).toBe(hash));
});
