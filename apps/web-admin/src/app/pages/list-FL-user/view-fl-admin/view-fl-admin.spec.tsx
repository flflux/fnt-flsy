import { render } from '@testing-library/react';

import ViewFLUserComponent from './view-fl-admin';

describe('ViewResident', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewFLUserComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
