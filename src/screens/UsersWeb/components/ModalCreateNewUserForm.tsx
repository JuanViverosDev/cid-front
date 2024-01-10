import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

//Services
import roleMock from '../../../mocks/roles.mock.json';
// import positionMock from '../../../mocks/positions.mock.json';
import { createWebUsers, updateWebUsers } from '../../../services/webUsers.service';

//Helpers API
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { getAllRoles } from '../../../services/roles.service';
import { MenuItem, Select } from '@mui/material';

export const ModalCreateNewUserForm = ({
  openModal,
  setOpenModal,
  userSelected,
  setUserSaved,
  userSaved,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //const [, setPosition] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [roleSelected, setRoleSelected] = useState([]);
  // const [, setPositionSelected] = useState('');
  const [userState, setUserState] = useState(false);

  // Get user id to update
  const [userId, setUserId] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);

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

  /* const validEmail = new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}'); */
  const [, setButtonSave] = useState(false);
  const [, setLoading] = useState(false);

  const tooglePassword = (e: any) => {
    e.preventDefault();
    setPasswordShow(!passwordShow);
  };

  useEffect(() => {
    setUserName(userSelected ? userSelected.userName : '');
    setLastName(userSelected ? userSelected.userLastName : '');
    setEmail(userSelected ? userSelected.userEmail : '');
    //setPosition(userSelected ? userSelected.userPosition?.positionName : '');
    setPassword(userSelected ? userSelected.password : '');

    setRoleSelected(userSelected ? userSelected?.role !== null && [userSelected?.role?.id] : []);
    /* setPositionSelected(
      userSelected
        ? userSelected.position !== null && userSelected.position.id
        : 0
    ); */
    setUserState(userSelected ? userSelected.userState : true);
    setUserId(userSelected ? userSelected.id : '');
    getRoles();
    //getPositions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const getRoles = async () => {
    try {
      const response = await callEndpoint(getAllRoles());
      // const response = await roleMock;
      response.success && setRoles([{ id: false, roleName: '-Seleccionar-' }, ...response.data]);
    } catch (error) {
      showToast('error', 'Ocurrió un error realizando la consulta', 'Contacte a soporte técnico');
    }
  };
  // const getPositions = async () => {
  //   try {
  //     // const response = await callEndpoint(getAllRoles());
  //     const response = await positionMock;
  //     response.success && setPosition(response.data);
  //   } catch (error) {
  //     showToast('error', 'An error occurred loading the information', 'Contact technical support');
  //   }
  // };
  const handleRoleSelected = (event: any) => {
    setRoleSelected(event.target.value as string);
  };
  // const handlePositionSelected = (event: any) => {
  //   setPositionSelected(event.target.value as string);
  // };
  const handleStateSelected = (event: any) => {
    setUserState(event.target.value);
  };

  /* const validateEmail = (email: any) => {
    return !validEmail.test(email);
  }; */

  const checkDataForm = (body: any) => {
    return body.userName === '';
  };

  const handleSubmit = async () => {
    setLoading(true);
    const body = {
      userName: userName,
      userLastName: lastName,
      userEmail: email,
      password: password,
      userState: userState,
      roles: roleSelected.filter((item: any) => item !== undefined),
      role_id: roleSelected.filter((item: any) => item !== undefined)[0],
    };

    if (body.role_id) {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createWebUsers(body));
          if (response.success) {
            setOpenModal(false);
            setUserSaved(!userSaved);
            showToast('success', '¡Usuario creado!', 'Recuerde entregar las credenciales de acceso al usuario');
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
          setOpenModal(false);
          setUserSaved(!userSaved);
          showToast('success', '¡usuario creado!', '');
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updateWebUsers(userId, body));
          if (response.success) {
            showToast('success', '¡Usuario actualizado!', '');
            setOpenModal(false);
            //Reload list with newRole
            setUserSaved(!userSaved);
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
        } else {
          showToast('warning', 'Verifique su información', 'Debe ingresar un correo válido');
        }
      } catch (error) {
        setButtonSave(false);
        showToast(
          'error',
          'Un error ocurrió creando ó actualizando los datos del agente',
          'Por favor, comuníquese con soporte técnico',
        );
      }
    } else {
      showToast('warning', 'Por favor revise la información suministrada', 'Debe seleccionar un rol');
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
                <h3 className="text-lg leading-6 font-medium text-primary">Usuarios Agentes</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Diligencie el siguiente formulario para crear un agente.
                </p>
              </div>
              {/* Identificacion */}
              {/* <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5'>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    Identificación
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <div className='max-w-lg flex rounded-md shadow-sm'>
                      <input
                        required
                        type='text'
                        name='id'
                        id='id'
                        value={userId ? userId : ""}
                        autoComplete='username'
                        onChange={(e) => setUserId(e.target.value)}
                        maxLength={50}
                        placeholder='Max. 50 characters'
                        className='max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300'
                      />
                    </div>
                  </div>
                </div>
              </div> */}
              {/* Name */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Nombre
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="username"
                        id="username"
                        value={userName ? userName : ''}
                        autoComplete="username"
                        onChange={(e) => setUserName(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* LastName */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Apellidos
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={lastName ? lastName : ''}
                        autoComplete="lastname"
                        onChange={(e) => setLastName(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Email */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Correo electrónico
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        value={email ? email : ''}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={50}
                        placeholder="Max. 50 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Contraseña */}
              <div className="mt-6 relative sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Contraseña
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required={typeOfCRUDAction === 'create'}
                        type={passwordShow ? 'text' : 'password'}
                        disabled={typeOfCRUDAction === 'edit'}
                        name="password"
                        id="password"
                        value={password ? password : ''}
                        autoComplete="password"
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={20}
                        placeholder="Max. 20 caracteres"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center ">
                        <button onClick={tooglePassword}>
                          {passwordShow ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Role */}
              {/* <div className='mt-6 sm:mt-5 space-y-6 sm:space-y-5'>
                <div className='sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5'>
                  <label
                    htmlFor='username'
                    className='block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2'
                  >
                    Cargo
                  </label>
                  <div className='mt-1 sm:mt-0 sm:col-span-2'>
                    <select
                      required
                      id='position'
                      name='position'
                      autoComplete='position-name'
                      value={`${positionSelected}`}
                      onChange={(e): any => {
                        handlePositionSelected(e);
                      }}
                      className='max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
                    >
                      {position.map((position: any) => (
                        <option key={position.id} value={position.id}>
                          {position.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div> */}
              {/* Role */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Perfil o rol
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <Select
                      required
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={roleSelected}
                      onChange={(e): any => {
                        handleRoleSelected(e);
                      }}
                      multiple
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      {roles.map((rol: any) => (
                        <MenuItem key={rol.id} value={rol.id}>
                          {rol.roleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
              {/* State */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Estado
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={`${userState}`}
                      onChange={(e): any => {
                        handleStateSelected(e);
                      }}
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  Action Buttons   */}
          <div className="pt-5 sticky bottom-0 bg-white left-0 right-0 pb-5">
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
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
