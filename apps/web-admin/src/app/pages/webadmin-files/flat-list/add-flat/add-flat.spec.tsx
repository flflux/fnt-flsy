import { render } from '@testing-library/react';
import AddFlatComponent from './add-flat';
import { AddFlat } from '@fnt-flsy/data-transfer-types';

describe('AddFlat', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddFlatComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: AddFlat): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
