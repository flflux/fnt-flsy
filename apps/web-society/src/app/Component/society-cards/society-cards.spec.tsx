import { render } from '@testing-library/react';

import SocietyCards from './society-cards';

describe('SocietyCards', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SocietyCards />);
    expect(baseElement).toBeTruthy();
  });
});
