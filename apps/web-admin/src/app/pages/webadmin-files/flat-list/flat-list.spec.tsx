import { render } from '@testing-library/react';

import FlatList from './flat-list';

describe('FlatList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlatList />);
    expect(baseElement).toBeTruthy();
  });
});
