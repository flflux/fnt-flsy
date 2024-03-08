import { render } from '@testing-library/react';

import DeviceImage from './device-image';

describe('DeviceImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeviceImage />);
    expect(baseElement).toBeTruthy();
  });
});
