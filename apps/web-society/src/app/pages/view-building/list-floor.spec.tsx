import { render } from '@testing-library/react';

import ListFloor from './list-floor';

describe('ListFloor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListFloor />);
    expect(baseElement).toBeTruthy();
  });
});
