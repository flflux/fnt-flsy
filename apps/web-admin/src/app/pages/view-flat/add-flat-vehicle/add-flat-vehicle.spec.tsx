import { render } from '@testing-library/react';


import AddFlatVehicleComponent from './add-flat-vehicle';

interface Form{
  buildingId:number;
  floorId:number;
  flatId:number;
  number:string;
  name:string;
  type:string;
  isActive:boolean;
}

describe('AddVehicle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddFlatVehicleComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
