import PropTypes from 'prop-types';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export const CidDataGrid = ({ rows, columns, rowsPerPage, onCellDoubleClick }: any) => {
  return (
    <div style={{ width: '100%' }}>
      <DataGrid
        density="compact"
        rows={rows}
        columns={columns}
        pageSize={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        onCellDoubleClick={onCellDoubleClick}
        autoHeight={true}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
};

CidDataGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number,
  onCellDoubleClick: PropTypes.func,
  isLoading: PropTypes.bool,
};
