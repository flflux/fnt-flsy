import { render } from '@testing-library/react';

// import AddVehicle from './add-vehicle';
import AddVehicleComponent from './add-vehicle';
import { AddVehicle } from '@fnt-flsy/data-transfer-types';

describe('AddVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddVehicleComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: AddVehicle): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
