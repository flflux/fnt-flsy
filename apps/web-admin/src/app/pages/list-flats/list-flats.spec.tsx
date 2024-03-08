import { render } from '@testing-library/react';

import AddFloors from './add-floors';

describe('AddFloors', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddFloors />);
    expect(baseElement).toBeTruthy();
  });
});
