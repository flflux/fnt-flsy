import { render } from '@testing-library/react';

import AddFlats from './add-flats';

describe('AddFlats', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddFlats />);
    expect(baseElement).toBeTruthy();
  });
});
