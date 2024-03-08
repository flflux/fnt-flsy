import { render } from '@testing-library/react';

import ListBuildings from './list-buildings';

describe('ListBuildings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListBuildings />);
    expect(baseElement).toBeTruthy();
  });
});
