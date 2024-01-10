import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export const ProductsFilters = ({ setProductFilterButton }: any) => {
  const [view, setView] = React.useState('list');
  const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
    setView(nextView);
  };

  return (
    <div className="flex flex-row-reverse">
      <ToggleButtonGroup
        style={{ height: '37.13px' }}
        size="small"
        orientation="horizontal"
        value={view}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="list" aria-label="list" onClick={() => setProductFilterButton(true)}>
          <ViewListIcon />
        </ToggleButton>
        <ToggleButton value="module" aria-label="module" onClick={() => setProductFilterButton(false)}>
          <ViewModuleIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};
