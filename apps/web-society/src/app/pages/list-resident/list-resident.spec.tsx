import { render } from '@testing-library/react';

import ResidentList from './resident-list';

describe('ResidentList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResidentList />);
    expect(baseElement).toBeTruthy();
  });
});
