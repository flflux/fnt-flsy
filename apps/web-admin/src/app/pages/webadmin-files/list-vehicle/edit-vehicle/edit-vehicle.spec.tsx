import { render } from '@testing-library/react';

import EditVehicle from './edit-vehicle';

describe('EditVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditVehicle />);
    expect(baseElement).toBeTruthy();
  });
});
