import { render } from '@testing-library/react';

import ListVehicle from './list-vehicle';

describe('ListVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListVehicle />);
    expect(baseElement).toBeTruthy();
  });
});
