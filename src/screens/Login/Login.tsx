import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// Assets
import emcaliLogo from '../../assets/images/LOGO-EMCALI.png';
// Components
import { Alerts } from '../../components';
// Slices
import { setLoggedUser, setNewToken, setSidebarMenu } from '../../redux/states/authSlice';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { login } from '../../services/auth.service';

export const Login = () => {
  const { callEndpoint } = useFetchAndLoad();

  // const responseMock = loginMock;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const validEmail = new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}');

  const [buttonLogin, setButtonLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState(false);

  //Show password
  const [passwordShow, setPasswordShow] = useState(false);
  const tooglePassword = (e: any) => {
    e.preventDefault();
    setPasswordShow(!passwordShow);
  };

  const dispatch = useDispatch();

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const body = { email, password };

    if (checkDataForm(body) || validateEmail(body.email)) {
      showToast(
        'warning',
        'Please, check your information account',
        'The user account you are logging in with is not correct.',
      );
      setLoading(false);
      setButtonLogin(false);
    } else {
      try {
        const response = await callEndpoint(login(body));
        if (response.success) {
          // authLoginAdapter(response);
          if (response.data.menu === null || response.data.menu.length === 0) {
            showToast('danger', 'Please, contact with support department', 'This user has no associated modules.');
            setButtonLogin(false);
            setLoading(false);
            return;
          } else {
            let burnMenu = [];
            response.data.menu.forEach((item: any) => {
              if (item.categoryName === 'General') {
                if (response.data.user.userRole.id === 'dd1cdabc-d122-4a83-8b8a-2dd35d588c97') {
                  item.categoryModule.push({
                    id: 'a',
                    moduleIcon: 'uil uil-file-question-alt',
                    moduleName: 'Notificaciones',
                    moduleOrder: 4,
                    moduleState: true,
                    moduleUrl: '/notificaciones',
                    permission: [
                      {
                        canCreate: true,
                        canDelete: true,
                        canUpdate: true,
                        canView: true,
                      },
                    ],
                  });
                }
              }
              burnMenu.push(item);
            });
            dispatch(setSidebarMenu(burnMenu));
            dispatch(setLoggedUser(response.data.user));
            dispatch(setNewToken(response.data.stsTokenManager.token));

            navigate(response.data.menu[0].categoryModule[0].moduleUrl, {
              replace: true,
            });
          }
        } else {
          setButtonLogin(false);
          setLoading(false);
          setAlerts(true);
        }
      } catch (error) {
        setButtonLogin(false);
        setLoading(false);
      }
    }
  };

  const checkDataForm = (body: any) => {
    return body.email === '' && body.password === '';
  };

  const validateEmail = (email: any) => {
    return !validEmail.test(email);
  };

  return (
    <>
      <div className="h-screen flex">
        <div className="flex-1 flex flex-col justify-center py-12 pl-4 sm:pl-6 lg:flex-none lg:pl-20 xl:pl-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Iniciar sesión</h2>
              <p className="mt-1 text-lg text-gray-500">Digite su correo y contraseña para ingresar.</p>
            </div>
            <div className="mt-8">
              <div>
                <div>
                  <div className="mt-1 grid grid-cols-3 gap-3">
                    <div></div>
                  </div>
                </div>
              </div>
              {/* alert messages for email/password issues */}

              {alerts && (
                <Alerts
                  type={'red'}
                  title={'Contraseña o email incorrectos'}
                  description={'Por favor, revise sus credenciales de acceso.'}
                />
              )}

              <div className="mt-6">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <div className="mt-1 mb-6">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="password"
                        name="password"
                        type={passwordShow ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
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

                  <br />
                  <div>
                    <button
                      disabled={buttonLogin}
                      className="w-full flex justify-center py-4 px-6 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 "
                      onClick={handleSubmit}
                    >
                      <span hidden={loading}>Iniciar sesión</span>{' '}
                      <span hidden={!loading}>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex relative w-0 flex-1 loginBg rounded-bl-login  justify-center items-center">
          {/* <img alt='CID logo' src={cidlogo} /> */}
          <img alt="CID logo" src={emcaliLogo} className="absolute bottom-0 right-0" style={{ width: 230 }} />
        </div>
      </div>
    </>
  );
};
