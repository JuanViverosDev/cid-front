import { Switch } from '@headlessui/react';
import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

//Services
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { createNewRole, updateRole /* getModulesByRoles */ } from '../../../services/roles.service';
//mock
import modulesMock from '../../../mocks/modules.mock.json';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}
/**
 *
 *
 * @param {*} {
 *   openModal: true/false to openModal(Drawer),
 *   setOpenModal: Close modal from modal cancel button ,
 *   roleSelected: Send role from list to view data,
 *   setRoleSaved: Toggle to indicate signal to reload role list,
 *   roleSaved: Toggle to indicate signal to reload role list,
 *   typeOfCRUDAction: Type of CRUD action mode. Eg: Create, edit...,
 * }
 * @return {*}
 */
export const ModalCreateRol = ({
  openModal,
  setOpenModal,
  roleSelected,
  setRoleSaved,
  roleSaved,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [modules, setModules] = useState<any>();
  const [modulesToSave, setModulesToSave] = useState<any[]>([]);
  const [roleName, setRoleName] = useState('No name');
  const [roleState, setRoleState] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const responseMock = modulesMock;

  const showToast = (icon: any, title: any, text: any) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
      text: text,
    });
  };

  useEffect(() => {
    getModulesByRol(roleSelected ? roleSelected.id : 0);
    setRoleName(roleSelected ? roleSelected.roleName : '');
    setRoleState(roleSelected ? roleSelected.roleState : true);
    setRoleId(roleSelected ? roleSelected.id : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const checkDataForm = (newRole: any) => {
    return newRole.roleName === '';
  };

  /**
   *
   *
   * @param {*} [role] Service
   */
  const getModulesByRol = async (role?: any) => {
    try {
      //const response = await callEndpoint(getModulesByRoles(role));
      const response = await responseMock;

      response.success && setModules(response.data);
    } catch (error) {
      showToast('error', 'Please, contact with support department', 'This user has no associated modules.');
    }
  };
  /**
   *
   *
   * @param {*} allModules Copy all modules from rol
   * @param {boolean} isActive
   * @param {*} indice
   */
  const handleActiveModule = (allModules: any, permissionState: boolean, indice: any, typeOfPermission: string) => {
    permissionState === null && (permissionState = false);

    let modulesEdited = [...allModules];

    if (typeOfPermission === 'canView') {
      modulesEdited[indice].p_m_canView = !permissionState;
      if (modulesEdited[indice].p_m_canEdit || modulesEdited[indice].p_m_canCreate) {
        modulesEdited[indice].p_m_canView = true;
      }
    } else if (typeOfPermission === 'canCreate') {
      modulesEdited[indice].p_m_canCreate = !permissionState;
      modulesEdited[indice].p_m_canCreate && (modulesEdited[indice].p_m_canView = true);
    } else {
      modulesEdited[indice].p_m_canEdit = !permissionState;
      modulesEdited[indice].p_m_canEdit && (modulesEdited[indice].p_m_canView = true);
    }

    setModules(modulesEdited);

    setModulesToSave(
      modulesEdited
        .filter((module) => module.p_m_canView || module.p_m_canCreate || module.p_m_canEdit)
        .map((modulesSelected) => ({
          id: modulesSelected.m_id,
          canView: modulesSelected.p_m_canView,
          canCreate: modulesSelected.p_m_canCreate,
          canEdit: modulesSelected.p_m_canEdit,
        })),
    );
  };
  /**
   *  Aynsc Func to save a role
   *
   */
  const handleSubmit = async () => {
    const body = {
      roleName: roleName,
      roleModules: modulesToSave,
      requestManager: true,
      roleState: roleState,
    };

    if (checkDataForm(body)) {
      showToast('warning', 'Por favor, verifique la información suministrada', '');
    } else {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createNewRole(body));
          if (response.success) {
            setOpenModal(false);
            //Reload list with newRole
            setRoleSaved(!roleSaved);
            showToast('success', '¡Rol creado!', '');
          }
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateRole(roleId, body));
          if (response.success) {
            setOpenModal(false);
            //Reload list with newRole
            setRoleSaved(!roleSaved);
            showToast('success', '¡Rol actualizado!', '');
          }
        } else {
          return;
        }
      } catch (error) {
        showToast('error', 'Ocurrió un error realizando la consulta', 'Por favor, contacte a soporte técnico');
      }
    }
  };

  return (
    <div>
      <Drawer className="w-screen" anchor="right" open={openModal} onClose={() => setOpenModal(!openModal)}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8 divide-y divide-gray-200 p-5 relative test">
          {/*  Form Inputs   */}
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Nuevo Rol</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Ingrese el nombre del nuevo role, seleccione los modulos y permisos que estarán asociados a este rol.
                </p>
              </div>

              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Nombre de rol
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="username"
                        id="username"
                        value={roleName ? roleName : ''}
                        autoComplete="username"
                        onChange={(e) => setRoleName(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Estado
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    id="state"
                    name="state"
                    autoComplete="state-name"
                    value={`${roleState}`}
                    onChange={(e) => setRoleState(e.target.value === 'true')}
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
              <div className="divide-y divide-gray-200">
                <div>
                  <div>
                    <h2 className="mt-1 text-lg leading-6 font-medium text-gray-900">Permisos</h2>
                    <p className="mt-1 text-sm text-gray-500">Por favor, indique los permisos que tendrá este rol.</p>
                    <div
                      className="py-2
                      items-center
                      justify-between
                      mt-2
                      grid
                      grid-cols-4"
                    >
                      <h3 className="mt-6 text-l leading-6 font-medium text-gray-900">Modulos</h3>
                      <h3 className="mt-6 text-l leading-6 font-medium text-gray-900">Ver</h3>
                      <h3 className="mt-6 text-l leading-6 font-medium text-gray-900">Crear</h3>
                      <h3 className="mt-6 text-l leading-6 font-medium text-gray-900">Editar</h3>
                    </div>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {modules?.map((module: any, indice: any) => (
                        <Switch.Group key={module.m_id} as="li" className="py-2 justify-between mt-2 grid grid-cols-4">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                              {module.m_name.charAt(0).toUpperCase()}
                              {module.m_name.slice(1)}
                            </Switch.Label>
                            <Switch.Description className="text-sm text-gray-500">
                              {module.m_description.charAt(0).toUpperCase()}
                              {module.m_description.slice(1)}
                            </Switch.Description>
                          </div>
                          {/*View Permission*/}{' '}
                          <Switch
                            id={`canView-${module.id}`}
                            checked={module.p_m_canView}
                            onChange={() => handleActiveModule(modules, module.p_m_canView, indice, 'canView')}
                            className={classNames(
                              module.p_m_canView ? 'bg-cidPrimaryGreen' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                module.p_m_canView ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                              )}
                            />
                          </Switch>
                          {/*Create Permission*/}{' '}
                          <Switch
                            id={`canCreate-${module.id}`}
                            checked={module.p_m_canCreate}
                            onChange={() => handleActiveModule(modules, module.p_m_canCreate, indice, 'canCreate')}
                            className={classNames(
                              module.p_m_canCreate ? 'bg-cidPrimaryGreen' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                module.p_m_canCreate ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                              )}
                            />
                          </Switch>
                          {/*Edit Permission*/}{' '}
                          <Switch
                            id={`canEdit-${module.id}`}
                            checked={module.p_m_canEdit}
                            onChange={() => handleActiveModule(modules, module.p_m_canEdit, indice, 'canEdit')}
                            className={classNames(
                              module.p_m_canEdit ? 'bg-cidPrimaryGreen' : 'bg-gray-200',
                              'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500',
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                module.p_m_canEdit ? 'translate-x-5' : 'translate-x-0',
                                'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  Action Buttons   */}
          <div className="pt-5 sticky bottom-0 bg-white left-0 right-0 p-5 pr-10">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
