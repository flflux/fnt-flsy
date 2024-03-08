import { render } from '@testing-library/react';

import EditItem from './edit-item';

describe('EditItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditItem />);
    expect(baseElement).toBeTruthy();
  });
});
