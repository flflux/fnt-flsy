import { render } from '@testing-library/react';

import DeviceLogs from './device-logs';

describe('DeviceLogs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeviceLogs />);
    expect(baseElement).toBeTruthy();
  });
});
