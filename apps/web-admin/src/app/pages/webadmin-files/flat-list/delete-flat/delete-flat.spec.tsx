import { render } from '@testing-library/react';
import DeleteFlatComponent from './delete-flat';

describe('DeleteFlat', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteFlatComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
