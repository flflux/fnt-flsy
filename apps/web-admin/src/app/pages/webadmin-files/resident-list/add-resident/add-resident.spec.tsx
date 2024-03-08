import { render } from '@testing-library/react';

import AddResident from './add-resident';

describe('AddResident', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddResident />);
    expect(baseElement).toBeTruthy();
  });
});
