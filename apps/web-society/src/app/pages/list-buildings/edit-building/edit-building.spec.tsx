import { render } from '@testing-library/react';

import EditBuilding from './edit-building';

describe('EditBuilding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditBuilding />);
    expect(baseElement).toBeTruthy();
  });
});
