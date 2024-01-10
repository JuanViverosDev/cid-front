import Tooltip from '@mui/material/Tooltip';
import { GridActionsCellItem, GridRenderCellParams } from '@mui/x-data-grid';
import moment from 'moment';
import iconEdit from '../../../assets/images/svg/iconEdit.svg';
import iconLock from '../../../assets/images/svg/iconLock.svg';
import iconLockOpen from '../../../assets/images/svg/iconLockOpen.svg';
import { StateBadge, CidDataGrid } from '../../../components';
//Components

export const RoleTable = ({ rows, handleOpenModal, isLoading, canEdit }: any) => {
  const columns = [
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'actions',
      minWidth: 200,
      getActions: (params: GridRenderCellParams) => [
        <GridActionsCellItem
          className="bg-transparent"
          disabled={!canEdit}
          icon={
            <Tooltip title="View/Edit">
              <img src={iconEdit} className="" alt="Search role" />
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('edit', params.row);
          }}
          label="View/Edit"
        />,
        <GridActionsCellItem
          disabled={!canEdit}
          icon={
            <Tooltip title={params.row.roleState ? 'Bloquear rol' : 'Desbloquear role'}>
              {params.row.roleState ? (
                <img src={iconLockOpen} className="" alt="Cambiar estado del rol" />
              ) : (
                <img src={iconLock} className="" alt="Cambiar estado del rol" />
              )}
            </Tooltip>
          }
          onClick={(e: any) => {
            e.preventDefault();
            handleOpenModal('changeState', params.row);
          }}
          label="Change State"
        />,
      ],
    },
    { field: 'id', headerName: 'Id', minWidth: 400, cellClassName: 'MuiDataGrid-cell--textCenter' },
    {
      field: 'roleName',
      headerName: 'Nombre del rol',
      minWidth: 250,
      cellClassName: 'MuiDataGrid-cell--textLeft',
    },
    {
      field: 'createdAt',
      headerName: 'Fecha de creación',
      width: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',

      renderCell: (params: GridRenderCellParams) => moment(params.value).format('YYYY-MM-DD HH:MM:ss'),
    },
    {
      field: 'updatedAt',
      headerName: 'Fecha de actualización',
      minWidth: 200,
      cellClassName: 'MuiDataGrid-cell--textCenter',

      renderCell: (params: GridRenderCellParams) => moment(params.value).format('YYYY-MM-DD HH:MM:ss'),
    },
    {
      field: 'roleState',
      headerName: 'Estado',
      minWidth: 100,
      cellClassName: 'MuiDataGrid-cell--textCenter',
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? (
          <StateBadge label={'Activo'} state="success" />
        ) : (
          <StateBadge label={'Inactivo'} state="danger" />
        );
      },
    },
  ];

  return (
    <CidDataGrid
      onCellDoubleClick={(e: any) => handleOpenModal('edit', e.row)}
      rows={rows}
      columns={columns}
      rowsPerPage={10}
      isLoading={isLoading}
    />
  );
};
