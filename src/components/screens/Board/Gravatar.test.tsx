import { render, screen, waitFor } from '@testing-library/react';

import Gravatar from './Gravatar';

it('normalizes the email address when hashing', async () => {
  render(<Gravatar emailAddress="  MyEmailAddress@example.COM      " />);
  const titleElement = screen.getByAltText('MyEmailAddress@example.COM avatar');
  await waitFor(() =>
    expect(titleElement.getAttribute('src')).toBe(
      'https://gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee',
    ),
  );
});
