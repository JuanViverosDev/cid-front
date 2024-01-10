import { Box, Tab, Tabs, Typography } from '@mui/material';
import * as React from 'react';
import { MenuCategories } from './MenuCategories/MenuCategories';
import { MenuModules } from './MenuModules/MenuModules';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export const Menu = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <div>
        <Box className=" ml-27 mr-27 mt-5 w-auto  h-full" sx={{ height: '100%' }}>
          <Box
            sx={{
              borderBottom: 0,
              borderColor: 'divider',
              position: 'relative',
              bottom: '-1px',
              padding: '0px 72px',
            }}
          >
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Categories" />
              <Tab label="Modules" />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <MenuCategories />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MenuModules />
          </TabPanel>
        </Box>
      </div>
    </>
  );
};
