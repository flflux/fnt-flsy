import { render } from '@testing-library/react';

import DeleteAdmin from './delete-admin';

describe('DeleteAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteAdmin open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onDelete={function (): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
