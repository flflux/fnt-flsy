import { render } from '@testing-library/react';

import AddVehicle from './add-vehicle';

describe('AddVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddVehicle />);
    expect(baseElement).toBeTruthy();
  });
});
