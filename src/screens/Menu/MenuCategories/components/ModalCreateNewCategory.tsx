import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Swal from 'sweetalert2';
//Services
import Switch from '@mui/material/Switch';
import useFetchAndLoad from '../../../../hooks/useFetchAndLoad';
import { createNewCategory, updateCategory, getAvailableModules } from '../../../../services/menu.service';

export const ModalCreateNewCategory = ({
  openModal,
  setOpenModal,
  categorySelected,
  setCategorySaved,
  categorySaved,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [categoryName, setCategoryName] = useState('');
  const [categoryState, setCategoryState] = useState(true);

  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryId, setCategoryId] = useState(null);

  //Modules to save into category
  const [modules, setModules] = useState<any>([]);
  const [modulesSelected, setModulesSelected] = useState<any>([]);
  const [modulesToSave, setModulesToSave] = useState<any[]>([]);

  //Available Modules switch
  const [switchChecked, setSwitchChecked] = useState(false);

  const handleSelectAllCategoriesSwitch = (event: any) => {
    setSwitchChecked(event.target.checked);
  };

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
    setCategoryName(categorySelected ? categorySelected.name : '');
    setCategoryDescription(categorySelected ? categorySelected.description : '');
    setCategoryState(categorySelected ? categorySelected.state : true);
    setCategoryId(categorySelected ? categorySelected.id : 0);
    setModulesSelected(categorySelected !== undefined ? [...categorySelected.menuModule] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const checkDataForm = (newCategory: any) => {
    return newCategory.name === '';
  };

  useEffect(() => {
    getModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchChecked]);

  /**
   *t: Show all modules
   *d: Show available modules
   * @param {*} [role] Service
   */
  const getModules = async () => {
    try {
      const response = await callEndpoint(getAvailableModules(switchChecked));

      response.success && setModules(response.data.filter((item: any) => item.state && item));
    } catch (error) {
      showToast('error', 'Please, contact with support department', '');
    }
  };

  /**
   *  Aynsc Func to save a category
   *
   */
  const handleSubmit = async () => {
    const body = {
      name: categoryName,
      description: categoryDescription,
      state: categoryState,
      modules: modulesToSave,
    };

    if (checkDataForm(body)) {
      showToast(
        'warning',
        'Please, check your information',
        'To see this change reflected in the menu, please log out and log back in.',
      );
    } else {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createNewCategory(body));
          if (response.success) {
            setOpenModal(false);
            //Reload list with newCategory
            setCategorySaved(!categorySaved);
            showToast('success', 'Category created successfully', '');
          }
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateCategory(categoryId, body));

          if (response.success) {
            setOpenModal(false);
            //Reload list with newModule
            setCategorySaved(!categorySaved);
            showToast(
              'success',
              'Category updated successfully',
              'To see this change reflected in the menu, please log out and log back in.',
            );
          }
        } else {
          return;
        }
      } catch (error) {
        showToast('error', 'Please, contact with support department', 'This category could not be updated.');
      }
    }
  };

  const reOrder = (list: any, startIndex: any, endIndex: any) => {
    const listCopy = [...list];
    const [removed] = listCopy.splice(startIndex, 1);
    listCopy.splice(endIndex, 0, removed);
    return listCopy;
  };

  const moveItem = (e: any, row: any) => {
    e.preventDefault();
    const cloneModules = Array.from(modules);
    const modules2 = [...modulesSelected, row];

    setModulesSelected(modules2);

    setModulesToSave(
      modules2.map((item: any, index: number) => ({
        id: item.id,
        order: index,
      })),
    );

    setModules(cloneModules.filter((item: any) => item.id !== row.id));
  };

  const removeItem = (row: any) => {
    const cloneModules = Array.from(modulesSelected);
    let moduleTemp = [] as any[];
    setModules([...modules, row]);

    moduleTemp = cloneModules.filter((item: any) => {
      return item.id !== row.id;
    });

    setModulesSelected(moduleTemp);

    setModulesToSave(
      moduleTemp.map((item: any, index: number) => ({
        id: item.id,
        order: index,
      })),
    );
  };

  return (
    <div>
      <Drawer className="w-screen" anchor="right" open={openModal} onClose={() => setOpenModal(!openModal)}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8 divide-y divide-gray-200 p-5 relative test">
          {/*  Form Inputs   */}
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">New Category</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Enter the data corresponding to the category, activate the modules that are part of it and press save.
                </p>
              </div>
              {/* Category Name */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Category Name
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        type="text"
                        required
                        name="username"
                        id="username"
                        value={categoryName ? categoryName : ''}
                        autoComplete="username"
                        onChange={(e) => setCategoryName(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Category Description */}
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="about" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  Category Description
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="about"
                    name="about"
                    placeholder="Briefly describe how the category works."
                    rows={3}
                    value={categoryDescription ? categoryDescription : ''}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              {/* Category State */}
              <div className="mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                  State
                </label>
                <div className="mt-1 sm:mt-0 sm:col-span-2">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    value={`${categoryState}`}
                    onChange={(e) => setCategoryState(e.target.value === 'true')}
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <hr className="my-5" />

              {/* Listado de módulos */}

              <div className="pt-8 space-y-6 sm:pt-2 sm:space-y-5">
                <div className="divide-y divide-gray-200">
                  <div className="">
                    <div>
                      <h2 className="text-lg leading-6 font-medium text-gray-900">Modules</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Activate the modules that will belong to this category.{' '}
                      </p>
                    </div>
                    <hr className="my-5" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flow-root mt-6">
                          <div className="text-center text-1xl font-bold divide-y divide-gray-200 bg-white py-2">
                            Modules Availables
                          </div>
                          {/* Avalaibles Modules select */}
                          <div>
                            Show all Modules
                            <Switch
                              checked={switchChecked}
                              onChange={handleSelectAllCategoriesSwitch}
                              inputProps={{ 'aria-label': 'controlled' }}
                              color="success"
                            />
                          </div>
                          <ul className=" divide-y divide-gray-200">
                            {modules.map((module: any) => (
                              <li key={module.id} className="py-4">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{module.name}</p>
                                    {/* {<p className="text-sm text-gray-500 truncate">{'@' + module.handle}</p>} */}
                                  </div>

                                  <div>
                                    <a
                                      href="#!"
                                      onClick={(e) => moveItem(e, module)}
                                      className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-100"
                                    >
                                      Add
                                    </a>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* Selected */}
                      <DragDropContext
                        onDragEnd={(result: any) => {
                          const { source, destination } = result;
                          if (!destination) {
                            return;
                          }
                          if (destination.droppableId === source.droppableId) {
                            setModulesSelected((prev: any) => reOrder(prev, source.index, destination.index));
                          }
                        }}
                      >
                        <Droppable droppableId="modulesSelected">
                          {(droppableProvided: any) => (
                            <div>
                              <div className="flow-root mt-6 bg-gray-50 h-full border-2 border-dashed border-gray-500">
                                <div className="text-center text-1xl font-bold divide-y divide-gray-200 bg-white py-2">
                                  Modules Added
                                </div>
                                <ul
                                  {...droppableProvided.droppableProps}
                                  ref={droppableProvided.innerRef}
                                  className="mx-2 divide-y divide-gray-200"
                                >
                                  {modulesSelected.map((item: any, index: number) => (
                                    <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                                      {(draggableProvided: any) => (
                                        <li
                                          {...draggableProvided.draggableProps}
                                          ref={draggableProvided.innerRef}
                                          {...draggableProvided.dragHandleProps}
                                          key={item.id}
                                          className="py-4"
                                        >
                                          <div className="flex items-center space-x-4">
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                              {/* <p className="text-sm text-gray-500 truncate">{'@' + module.handle}</p> */}
                                            </div>
                                            <div>
                                              <a
                                                href="#!"
                                                onClick={() => removeItem(item)}
                                                className="inline-flex items-center shadow-sm px-2.5 py-0.5 text-sm leading-5 font-medium rounded-full text-white bg-hovercidTertiaryLightPurple hover:bg-cidTertiaryLightPurple"
                                              >
                                                Remove
                                              </a>
                                            </div>
                                          </div>
                                        </li>
                                      )}
                                    </Draggable>
                                  ))}
                                  {droppableProvided.placeholder}
                                </ul>
                              </div>
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
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
