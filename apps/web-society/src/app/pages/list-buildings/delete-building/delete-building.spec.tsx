import { render } from '@testing-library/react';

import DeleteBuilding from './delete-building';

describe('DeleteBuilding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteBuilding />);
    expect(baseElement).toBeTruthy();
  });
});
