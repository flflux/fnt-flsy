import { render } from '@testing-library/react';

import ViewDevices from './view-devices';

describe('ViewDevices', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewDevices />);
    expect(baseElement).toBeTruthy();
  });
});
