import { render } from '@testing-library/react';

import UpdatePassword from './update-password';

describe('UpdatePassword', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UpdatePassword />);
    expect(baseElement).toBeTruthy();
  });
});
