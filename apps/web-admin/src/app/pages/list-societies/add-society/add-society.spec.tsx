import { render } from '@testing-library/react';

import AddSociety from './add-society';

describe('AddSociety', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddSociety />);
    expect(baseElement).toBeTruthy();
  });
});
