import { render } from '@testing-library/react';

import View from './view';

describe('View', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<View />);
    expect(baseElement).toBeTruthy();
  });
});
