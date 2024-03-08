import { render } from '@testing-library/react';

import ListFLUser from './list-fl-user';

describe('ListUser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListFLUser />);
    expect(baseElement).toBeTruthy();
  });
});
