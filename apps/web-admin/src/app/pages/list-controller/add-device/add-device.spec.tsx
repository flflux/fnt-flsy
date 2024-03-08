import { render } from '@testing-library/react';


import AddDeviceComponent from './add-device';

interface Form {
  deviceId: number;
}

describe('AddController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddDeviceComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
