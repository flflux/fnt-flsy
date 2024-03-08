import { render } from '@testing-library/react';

import EditVehicleCard from './edit-vehicle-card';

describe('EditVehicleCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditVehicleCard />);
    expect(baseElement).toBeTruthy();
  });
});
