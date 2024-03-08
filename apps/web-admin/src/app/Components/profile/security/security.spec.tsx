import { render } from '@testing-library/react';

import Security from './security';

describe('Security', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Security />);
    expect(baseElement).toBeTruthy();
  });
});
