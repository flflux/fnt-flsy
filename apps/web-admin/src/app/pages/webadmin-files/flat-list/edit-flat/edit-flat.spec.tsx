import { render } from '@testing-library/react';
import EditFlatComponent from './edit-flat';
import { AddFlat } from '@fnt-flsy/data-transfer-types';

describe('EditFlat', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditFlatComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: AddFlat): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
