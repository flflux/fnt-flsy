import { render } from '@testing-library/react';

import TemplateOptions from './template-options';

describe('TemplateOptions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TemplateOptions onSelect={function (option: string): void {
      throw new Error('Function not implemented.');
    } } />);
    expect(baseElement).toBeTruthy();
  });
});
