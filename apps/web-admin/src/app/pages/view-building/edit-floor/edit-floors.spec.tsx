import { render } from '@testing-library/react';

import EditFloors from './edit-floors';

describe('EditFloors', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditFloors />);
    expect(baseElement).toBeTruthy();
  });
});
