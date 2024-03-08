import { render } from '@testing-library/react';

import ViewFlats from './view-flat';

describe('ViewFlats', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewFlats />);
    expect(baseElement).toBeTruthy();
  });
});
