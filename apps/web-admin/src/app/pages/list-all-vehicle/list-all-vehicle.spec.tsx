import { render } from '@testing-library/react';

import ListAllVehicle from './list-all-vehicle';

describe('ListAllVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListAllVehicle />);
    expect(baseElement).toBeTruthy();
  });
});
