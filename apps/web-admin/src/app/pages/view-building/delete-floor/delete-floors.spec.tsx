import { render } from '@testing-library/react';

import DeleteFloors from './delete-floors';

describe('DeleteFloors', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DeleteFloors />);
    expect(baseElement).toBeTruthy();
  });
});
