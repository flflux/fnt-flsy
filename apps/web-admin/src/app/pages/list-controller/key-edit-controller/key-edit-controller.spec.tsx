import { render } from '@testing-library/react';

import KeyEditControllerComponent from './key-edit-controller';


describe('EditController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KeyEditControllerComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
