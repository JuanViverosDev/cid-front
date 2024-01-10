import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
//Services
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import { createNewModule, updateModule } from '../../../../services/menu.service';

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
export const ModalCreateNewModule = ({
  openModal,
  setOpenModal,
  moduleSelected,
  setModuleSaved,
  moduleSaved,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [moduleName, setModuleName] = useState('No name');
  const [moduleDescription, setModuleDescription] = useState('No name');
  const [moduleUrl, setModuleUrl] = useState('No name');
  const [moduleIcon, setModuleIcon] = useState('No name');
  const [moduleState, setModuleState] = useState(true);
  const [moduleId, setModuleId] = useState(null);

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
    setModuleName(moduleSelected ? moduleSelected.name : '');
    setModuleDescription(moduleSelected ? moduleSelected.description : '');
    setModuleUrl(moduleSelected ? moduleSelected.url : '');
    setModuleIcon(moduleSelected ? moduleSelected.icon : '');
    setModuleState(moduleSelected ? moduleSelected.state : true);
    setModuleId(moduleSelected ? moduleSelected.id : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const checkDataForm = (newModule: any) => {
    return newModule.name === '' && newModule.url === '';
  };

  /**
   *  Aynsc Func to save a role
   *
   */
  const handleSubmit = async () => {
    const body = {
      name: moduleName,
      description: moduleDescription,
      state: moduleState,
      url: moduleUrl,
      icon: moduleIcon,
    };

    if (checkDataForm(body)) {
      showToast('warning', 'Please, check your information', '');
    } else {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createNewModule(body));
          if (response.success) {
            setOpenModal(false);
            //Reload list with newModule
            setModuleSaved(!moduleSaved);
            showToast('success', 'Module created successfully', '');
          }
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateModule(moduleId, body));
          if (response.success) {
            setOpenModal(false);
            //Reload list with newModule
            setModuleSaved(!moduleSaved);
            showToast('success', 'Module updated successfully', '');
          }
        } else {
          return;
        }
      } catch (error) {
        showToast('error', 'Please, contact with support department', 'An error occurred updating this module.');
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
                <h3 className="text-lg leading-6 font-medium text-gray-900">New Module</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Enter the data corresponding to the module and press save.
                </p>
              </div>
              {/* Module Name */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Module Name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="username"
                        id="username"
                        value={moduleName ? moduleName : ''}
                        autoComplete="username"
                        onChange={(e) => setModuleName(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Module Description */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Module Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="about"
                    name="about"
                    placeholder="Briefly describe how the module works."
                    rows={3}
                    value={moduleDescription ? moduleDescription : ''}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  />

                  <br />
                </div>
              </div>
              {/* Module URL */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Module URL
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="url"
                        id="url"
                        value={moduleUrl ? moduleUrl : ''}
                        autoComplete="url"
                        onChange={(e) => setModuleUrl(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Module Icon */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Module Icon
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="icon"
                        id="icon"
                        value={moduleIcon ? moduleIcon : ''}
                        autoComplete="icon"
                        onChange={(e) => setModuleIcon(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Module State */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  State
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    value={`${moduleState}`}
                    onChange={(e) => setModuleState(e.target.value === 'true')}
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
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
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cidPrimaryGreen hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
