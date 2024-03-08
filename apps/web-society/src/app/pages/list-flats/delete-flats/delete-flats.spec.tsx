import { render } from '@testing-library/react';

import DeleteFlats from './delete-flats';

describe('DeleteFlats', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteFlats />);
    expect(baseElement).toBeTruthy();
  });
});
