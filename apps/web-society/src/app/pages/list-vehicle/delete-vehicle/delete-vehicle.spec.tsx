import { render } from '@testing-library/react';

import DeleteVehicle from './delete-vehicle';

describe('DeleteVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteVehicle />);
    expect(baseElement).toBeTruthy();
  });
});
