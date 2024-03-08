import { render } from '@testing-library/react';

import ListController from './list-controller';

describe('ListController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListController />);
    expect(baseElement).toBeTruthy();
  });
});
