import React from 'react';

export const CKEditor = ({ onChange, data, ...props }: any) => {
  return (
    <textarea
      data-testid="mock-ckeditor"
      value={data}
      onChange={(e) =>
        onChange && onChange({ editor: { getData: () => e.target.value } })
      }
      {...props}
    />
  );
};
