import { render } from '@testing-library/react';

import DeleteVehicle from './delete-flat-vehicle';

describe('DeleteVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteVehicle open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
