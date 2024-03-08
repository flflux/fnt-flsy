import { render } from '@testing-library/react';

import AddFlatResidentComponent from './add-flat-resident';

interface Form {
  name: string;
  email: string;
  phoneNumber: string;
  isChild: boolean;
  type: string;
  buildingId: number;
  floorId: number,
  flatId: number,
  isActive: boolean
}

describe('AddResident', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddFlatResidentComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
