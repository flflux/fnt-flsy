import { render } from '@testing-library/react';

import EditController from './edit-controller';

describe('EditController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditController />);
    expect(baseElement).toBeTruthy();
  });
});
