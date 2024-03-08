import { render } from '@testing-library/react';

import VehicleLogs from './vehicle-logs';

describe('VehicleLogs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VehicleLogs />);
    expect(baseElement).toBeTruthy();
  });
});
