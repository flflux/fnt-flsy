import { render } from '@testing-library/react';

import AddBuildingComponent from './add-building';
import { AddBuilding } from '@fnt-flsy/data-transfer-types';

describe('AddBuilding', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AddBuildingComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onSubmit={function (data: AddBuilding): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
