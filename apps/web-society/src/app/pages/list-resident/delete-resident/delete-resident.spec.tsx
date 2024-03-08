import { render } from '@testing-library/react';

import DeleteResident from './delete-resident';

describe('DeleteResident', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteResident />);
    expect(baseElement).toBeTruthy();
  });
});
