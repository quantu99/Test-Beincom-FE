import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilterDropdown, FilterOptions } from '@/modules/home/components/FilterDropdown';

describe('FilterDropdown', () => {
  const defaultFilters: FilterOptions = {
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    limit: 10,
  };

  const setup = (isOpen = true) => {
    const onClose = jest.fn();
    const onApply = jest.fn();
    const onReset = jest.fn();

    render(
      <FilterDropdown
        isOpen={isOpen}
        filters={defaultFilters}
        onClose={onClose}
        onApply={onApply}
        onReset={onReset}
      />
    );

    return { onClose, onApply, onReset };
  };

  it('should not render when isOpen is false', () => {
    setup(false);
    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
  });

  it('should render correctly when isOpen is true', () => {
    setup();
    expect(screen.getByText('Filter')).toBeInTheDocument();
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Quantity displayed')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('should call onClose when clicking close button', () => {
    const { onClose } = setup();
    const closeBtn = screen.getByRole('button', { name: /x/i }) || screen.getByText((content, element) => element?.tagName === 'SVG');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('should update filters and call onApply when Apply is clicked', () => {
    const { onApply } = setup();
    const sortOption = screen.getByLabelText('Most popular');
    const limitOption = screen.getByLabelText('20 posts');

    fireEvent.click(sortOption);
    fireEvent.click(limitOption);

    fireEvent.click(screen.getByText('Apply'));
    expect(onApply).toHaveBeenCalledWith({
      sortBy: 'popular',
      sortOrder: 'DESC', 
      limit: 20,
    });
  });

  it('should reset filters and call onReset when Reset is clicked', () => {
    const { onReset } = setup();

    fireEvent.click(screen.getByLabelText('Most popular'));
    fireEvent.click(screen.getByLabelText('5 posts'));

    fireEvent.click(screen.getByText('Reset'));
    expect(onReset).toHaveBeenCalled();
    expect(screen.getByLabelText('Newest')).toBeChecked(); // createdAt, DESC, 10
    expect(screen.getByLabelText('10 posts')).toBeChecked();
  });
});
