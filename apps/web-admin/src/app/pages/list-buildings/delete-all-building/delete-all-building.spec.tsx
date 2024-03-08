import { render } from '@testing-library/react';

import DeleteAllBuilding from './delete-all-building';

describe('DeleteAllBuilding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteAllBuilding />);
    expect(baseElement).toBeTruthy();
  });
});
