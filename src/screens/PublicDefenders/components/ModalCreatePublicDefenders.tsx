import Drawer from '@mui/material/Drawer';
import { useEffect, useState } from 'react';

//Helpers API
import Swal from 'sweetalert2';
import { createPublicDefenders, updatePublicDefenders } from '../../../services';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

export const ModalCreatePublicDefenders = ({
  openModal,
  setOpenModal,
  setPublicDefenderSaved,
  publicDefenderSaved,
  publicDefenderSelected,
  typeOfCRUDAction,
}: any) => {
  const { callEndpoint } = useFetchAndLoad();

  const [publicDefenderName, setPublicDefenderName] = useState('');
  const [publicDefenderPhone, setPublicDefenderPhone] = useState('');
  const [publicDefenderAddress, setPublicDefenderAddress] = useState('');
  const [publicDefenderEmail, setPublicDefenderEmail] = useState('');
  const [publicDefenderCompany, setPublicDefenderCompany] = useState('');
  const [publicDefenderStartDate, setPublicDefenderStartDate] = useState('');
  const [publicDefenderEndDate, setPublicDefenderEndDate] = useState('');
  const [howManyProceedingsNumber, setHowManyProceedingsNumber] = useState<any>(0);
  const [proceedingsNumbers, setProceedingsNumbers] = useState('');
  const [publicDefenderState, setPublicDefenderState] = useState(false);
  const [medioAComunicar, setMedioAComunicar] = useState(null);
  const [publicDefenderId, setPublicDefenderId] = useState<any>('');

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
    setPublicDefenderName(publicDefenderSelected ? publicDefenderSelected.publicDefenderName : '');
    setPublicDefenderPhone(publicDefenderSelected ? publicDefenderSelected.publicDefenderPhone : '');
    setPublicDefenderAddress(publicDefenderSelected ? publicDefenderSelected.publicDefenderAddress : '');
    setPublicDefenderEmail(publicDefenderSelected ? publicDefenderSelected.publicDefenderEmail : '');
    setPublicDefenderCompany(publicDefenderSelected ? publicDefenderSelected.publicDefenderCompany : '');
    setPublicDefenderStartDate(publicDefenderSelected ? publicDefenderSelected.publicDefenderStartDate : '');
    setPublicDefenderEndDate(publicDefenderSelected ? publicDefenderSelected.publicDefenderEndDate : '');
    setHowManyProceedingsNumber(publicDefenderSelected ? publicDefenderSelected.howManyProceedingsNumber : 0);
    setProceedingsNumbers(publicDefenderSelected ? publicDefenderSelected.proceedingsNumbers : '');
    setPublicDefenderState(publicDefenderSelected ? publicDefenderSelected.publicDefenderState : true);
    setMedioAComunicar(publicDefenderSelected ? publicDefenderSelected.medioAComunicar : null);
    setPublicDefenderId(publicDefenderSelected ? publicDefenderSelected.publicDefenderId : '');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModal]);

  const handleStateSelected = (event: any) => {
    setPublicDefenderState(event.target.value === 'true');
  };

  const checkDataForm = (body: any) => {
    return (
      body.publicDefenderName === '' ||
      body.publicDefenderPhone === '' ||
      body.publicDefenderAddress === '' ||
      body.publicDefenderEmail === '' ||
      body.publicDefenderCompany === '' ||
      body.publicDefenderStartDate === '' ||
      body.publicDefenderEndDate === '' ||
      body.howManyProceedingsNumber === '' ||
      body.proceedingsNumbers === '' ||
      body.medioAComunicar === null ||
      body.publicDefenderState === ''
    );
  };

  const handleSubmit = async () => {
    const body = {
      publicDefenderName: publicDefenderName,
      publicDefenderPhone: publicDefenderPhone,
      publicDefenderAddress: publicDefenderAddress,
      publicDefenderEmail: publicDefenderEmail,
      publicDefenderCompany: publicDefenderCompany,
      publicDefenderStartDate: publicDefenderStartDate,
      publicDefenderEndDate: publicDefenderEndDate,
      howManyProceedingsNumber: parseInt(howManyProceedingsNumber),
      proceedingsNumbers: proceedingsNumbers,
      publicDefenderState: publicDefenderState,
      medioAComunicar: medioAComunicar,
      publicDefenderId: publicDefenderId,
    };
    if (checkDataForm(body)) {
      showToast('warning', 'Please, check your information', '');
    } else {
      try {
        if (typeOfCRUDAction === 'create') {
          const response = await callEndpoint(createPublicDefenders(body));
          if (response.success) {
            setOpenModal(false);
            setPublicDefenderSaved(!publicDefenderSaved);
            showToast('success', '¡Abogado de oficio creado!', '');
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
        } else if (typeOfCRUDAction === 'edit') {
          const response = await callEndpoint(updatePublicDefenders(publicDefenderSelected, body));
          if (response.success) {
            showToast('success', 'Abogado de oficio actualizado!', '');
            setOpenModal(false);
            //Reload list with newRole
            setPublicDefenderSaved(!publicDefenderSaved);
          } else {
            showToast('warning', 'Por favor revise la información suministrada', response.message);
          }
        } else {
          showToast('warning', 'Por favor revise la información suministrada', '');
        }
      } catch (error) {
        showToast('error', 'Ocurrió un error haciendo la consulta', 'Por favor comuníquese con soporte técnico');
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
                <h3 className="text-lg leading-6 font-medium text-primary">Abogados de oficio</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Diligencie los campos para crear un nuevo abogado de oficio.
                </p>
              </div>
              {/* name */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Nombre abogado de oficio{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="name"
                        id="name"
                        value={publicDefenderName ? publicDefenderName : ''}
                        autoComplete="name"
                        onChange={(e) => setPublicDefenderName(e.target.value)}
                        maxLength={200}
                        placeholder="Max. 200 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Número de identificación del abogado de oficio{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="number"
                        name="id"
                        id="id"
                        value={publicDefenderId ? publicDefenderId : ''}
                        autoComplete="id"
                        onChange={(e) => setPublicDefenderId(e.target.value)}
                        maxLength={200}
                        placeholder="Max. 200 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* phone */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Celular abogado de oficio{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="phone"
                        id="phone"
                        value={publicDefenderPhone ? publicDefenderPhone : ''}
                        autoComplete="phone"
                        onChange={(e) => setPublicDefenderPhone(e.target.value)}
                        maxLength={200}
                        placeholder="Max. 200 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* address */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Dirección abogado de oficio{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="address"
                        id="address"
                        value={publicDefenderAddress ? publicDefenderAddress : ''}
                        autoComplete="address"
                        onChange={(e) => setPublicDefenderAddress(e.target.value)}
                        maxLength={200}
                        placeholder="Max. 200 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* email */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Correo electrónico abogado de oficio{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        value={publicDefenderEmail ? publicDefenderEmail : ''}
                        autoComplete="email"
                        onChange={(e) => setPublicDefenderEmail(e.target.value)}
                        maxLength={200}
                        placeholder="Max. 200 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* company */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Organización abogado de oficio{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="text"
                        name="company"
                        id="company"
                        value={publicDefenderCompany ? publicDefenderCompany : ''}
                        autoComplete="company"
                        onChange={(e) => setPublicDefenderCompany(e.target.value)}
                        maxLength={200}
                        placeholder="Max. 200 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Fecha inicio encargo */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Fecha inicio encargo{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={publicDefenderStartDate ? publicDefenderStartDate : ''}
                        autoComplete="startDate"
                        onChange={(e) => setPublicDefenderStartDate(e.target.value)}
                        maxLength={100}
                        placeholder="Max. 100 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Fecha finalización encargo */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Fecha finalización encargo{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <input
                        required
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={publicDefenderEndDate ? publicDefenderEndDate : ''}
                        autoComplete="endDate"
                        onChange={(e) => setPublicDefenderEndDate(e.target.value)}
                        maxLength={100}
                        placeholder="Max. 100 characters"
                        className="max-w-lg flex-1 p-20 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Número de expedientes asignados */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label
                    htmlFor="howManyProceedingsNumber"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Número de expedientes asignados{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="max-w-lg flex rounded-md shadow-sm">
                      <select
                        required
                        name="howManyProceedingsNumber"
                        id="howManyProceedingsNumber"
                        value={howManyProceedingsNumber ? howManyProceedingsNumber : ''}
                        autoComplete="howManyProceedingsNumber"
                        onChange={(e) => setHowManyProceedingsNumber(e.target.value)}
                        className="max-w-lg flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={7}>7</option>
                        <option value={8}>8</option>
                        <option value={9}>9</option>
                        <option value={10}>10</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Números de expedientes */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Números de expedientes{' '}
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <div className="flex rounded-md shadow-sm">
                      <textarea
                        required
                        name="endDate"
                        id="endDate"
                        value={proceedingsNumbers ? proceedingsNumbers : ''}
                        autoComplete="endDate"
                        onChange={(e) => setProceedingsNumbers(e.target.value)}
                        maxLength={500}
                        placeholder="Max. 500 characters"
                        className="max-w flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medio a comunicar */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Medio a comunicar
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="medioAComunicar"
                      name="medioAComunicar"
                      autoComplete="medioAComunicar"
                      value={`${medioAComunicar}`}
                      onChange={(e): any => {
                        setMedioAComunicar(e.target.value);
                      }}
                      className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value={null}>Selecciona una opción</option>
                      <option value="email">Correo electrónico</option>
                      <option value="fisico">Personal</option>
                      <option value="ambos">Ambos</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* State */}
              <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5 pb-5">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Estado
                  </label>
                  <div className="mt-1 sm:mt-0 sm:col-span-2">
                    <select
                      id="state"
                      name="state"
                      autoComplete="state"
                      value={`${publicDefenderState}`}
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
