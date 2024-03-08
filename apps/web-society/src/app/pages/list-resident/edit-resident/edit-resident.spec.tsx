import { render } from '@testing-library/react';

// import EditResident from './edit-resident';
import EditResidentComponent from './edit-resident';
import { AddResident } from '@fnt-flsy/data-transfer-types';

describe('EditResident', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditResidentComponent open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: AddResident): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
