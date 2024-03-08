import { render } from '@testing-library/react';

import ViewResidentComponent from './view-resident';

describe('ViewResident', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewResidentComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } residentId={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
