import { render } from '@testing-library/react';

import ViewSocietyPage from './view-society-page';

describe('ViewSocietyPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewSocietyPage />);
    expect(baseElement).toBeTruthy();
  });
});
