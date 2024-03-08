import { render } from '@testing-library/react';

import NameEditControllerComponent from './name-edit-controller';

interface Form{
  name:string;
}

describe('EditController', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NameEditControllerComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
