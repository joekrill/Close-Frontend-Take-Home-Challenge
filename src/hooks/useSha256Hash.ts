import { useEffect, useState } from 'react';

export const useSha256Hash = (input: string) => {
  const [hash, setHash] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const encodedInput = new TextEncoder().encode(input);
    crypto.subtle.digest('SHA-256', encodedInput).then((digest) => {
      if (cancelled) {
        return;
      }

      const digestArray = Array.from(new Uint8Array(digest));
      const hash = digestArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      setHash(hash);
    });

    return () => {
      cancelled = true;
    };
  }, [input]);

  return hash;
};
