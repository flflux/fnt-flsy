import { render } from '@testing-library/react';

import EditSocietyPage from './edit-society-page';

describe('EditSocietyPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditSocietyPage />);
    expect(baseElement).toBeTruthy();
  });
});
