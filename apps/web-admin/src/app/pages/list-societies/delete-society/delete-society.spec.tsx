import { render } from '@testing-library/react';

import DeleteSociety from './delete-society';

describe('DeleteSociety', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteSociety />);
    expect(baseElement).toBeTruthy();
  });
});
