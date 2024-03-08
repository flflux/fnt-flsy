import { render } from '@testing-library/react';

import EditFlats from './edit-flats';

describe('EditFlats', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditFlats />);
    expect(baseElement).toBeTruthy();
  });
});
