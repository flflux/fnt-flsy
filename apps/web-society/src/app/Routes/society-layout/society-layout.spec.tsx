import { render } from '@testing-library/react';

import SocietyLayout from './society-layout';

describe('SocietyLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SocietyLayout />);
    expect(baseElement).toBeTruthy();
  });
});
