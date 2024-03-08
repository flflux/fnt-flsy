import { render } from '@testing-library/react';

import ListSocieties from './list-societies';

describe('ListSocieties', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListSocieties />);
    expect(baseElement).toBeTruthy();
  });
});
