import { render } from '@testing-library/react';

import Import from './import';

describe('Import', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Import />);
    expect(baseElement).toBeTruthy();
  });
});
