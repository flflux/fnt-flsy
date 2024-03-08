import { render } from '@testing-library/react';

import ListAllController from './list-all-controller';

describe('ListAllController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListAllController />);
    expect(baseElement).toBeTruthy();
  });
});
