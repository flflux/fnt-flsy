import { render } from '@testing-library/react';

import AllVehicleLogs from './all-vehicle-logs';

describe('AllVehicleLogs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AllVehicleLogs />);
    expect(baseElement).toBeTruthy();
  });
});
