import { render } from '@testing-library/react';
import DeleteVehicleComponent from './delete-vehicle';

describe('DeleteVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteVehicleComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
