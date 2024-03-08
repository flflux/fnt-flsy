import { render } from '@testing-library/react';

import AddVehicleCard from './add-vehicle-card';

describe('AddVehicleCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddVehicleCard />);
    expect(baseElement).toBeTruthy();
  });
});
