import { render } from '@testing-library/react';

import ForgetPassword from './forget-password';

describe('ForgetPassword', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ForgetPassword />);
    expect(baseElement).toBeTruthy();
  });
});
