import { render } from '@testing-library/react';

import AddSocietyPage from './add-society-page';

describe('AddSocietyPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddSocietyPage />);
    expect(baseElement).toBeTruthy();
  });
});
