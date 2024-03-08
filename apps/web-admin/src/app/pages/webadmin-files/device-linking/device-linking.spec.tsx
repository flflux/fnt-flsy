import { render } from '@testing-library/react';

import DeviceLinking from './device-linking';

describe('DeviceLinking', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeviceLinking />);
    expect(baseElement).toBeTruthy();
  });
});
