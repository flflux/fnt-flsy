import { render } from '@testing-library/react';

import ViewVehicles from './view-vehicles';

describe('ViewVehicles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewVehicles />);
    expect(baseElement).toBeTruthy();
  });
});
