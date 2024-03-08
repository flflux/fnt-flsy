import { render } from '@testing-library/react';

import DrawerComponent from './drawer-component';

describe('DrawerComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DrawerComponent />);
    expect(baseElement).toBeTruthy();
  });
});
