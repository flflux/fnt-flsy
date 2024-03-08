import { render } from '@testing-library/react';

import AddAdmin from './add-admin';

describe('AddAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddAdmin />);
    expect(baseElement).toBeTruthy();
  });
});
