import { render } from '@testing-library/react';

import LogOut from './log-out';

describe('LogOut', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LogOut />);
    expect(baseElement).toBeTruthy();
  });
});
