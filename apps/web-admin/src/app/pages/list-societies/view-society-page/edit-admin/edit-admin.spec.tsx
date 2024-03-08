import { render } from '@testing-library/react';
import EditAdmin from './edit-admin';


interface Form{
  name:string;
  number:number;
 }

describe('EditAdmin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditAdmin open={false} onClose={function (): void {
      throw new Error('Function not implemented.');
    } } onUpdate={function (data: Form): void {
      throw new Error('Function not implemented.');
    } } initialData={null} />);
    expect(baseElement).toBeTruthy();
  });
});
