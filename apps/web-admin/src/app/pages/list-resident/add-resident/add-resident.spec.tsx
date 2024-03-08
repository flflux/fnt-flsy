import { render } from '@testing-library/react';

import AddResident from './add-resident';

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
    const { baseElement } = render(<AddResident open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
