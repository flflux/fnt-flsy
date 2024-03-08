import { render } from '@testing-library/react';

import AddController from './add-controller';

describe('AddController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddController />);
    expect(baseElement).toBeTruthy();
  });
});
