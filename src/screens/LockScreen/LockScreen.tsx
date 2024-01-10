import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { Animated } from 'react-animated-css';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Alerts } from '../../components';
import { LOGIN_MODEL, AUTH } from '../../models';
import { setLoggedUser, setNewToken, setReLogin, setSidebarMenu } from '../../redux/states/authSlice';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { ModalForgotPass } from '../Login/components/ModalForgotPass';
import { login } from '../../services/auth.service';

export const LockScreen = () => {
  const { callEndpoint } = useFetchAndLoad();

  const USER = useSelector(({ auth }: { auth: AUTH }) => auth.data.user);

  const [email] = useState(USER?.userEmail || '');
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

    const body: LOGIN_MODEL = { email,  password };

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
          if (response.data.menu === null || response.data.menu.length === 0) {
            showToast('warning', 'Please, contact with support department', 'This user has no associated modules.');
            setButtonLogin(false);
            setLoading(false);
            return;
          } else {
            dispatch(setSidebarMenu(response.data.menu));
            dispatch(setLoggedUser(response.data.user));
            dispatch(setNewToken(response.token));
            dispatch(setReLogin(false));
            // window.location.reload();
            // navigate(response.data.menu[0].menuModule[0].url, {
            //   replace: true,
            // });
            // navigate('/modules');
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
      <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
        <div className="h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 absolute w-full bg-cidSecundaryOliveGreen top-0 z-50">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src="https://www.cid.app/assets/images/Logo.svg"
              alt="cid.app - Haga sus compras internacionales fácil y rápida"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
              Your session has expired
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              <span className="font-medium text-cidPrimaryGreen">Please, enter your password to continue.</span>
            </p>
            {alerts ? (
              <Alerts
                type={'yellow'}
                title={'Incorrect credentials'}
                description={'Please check your email and your password'}
              />
            ) : (
              ''
            )}
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
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

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <ModalForgotPass />
                  </div>
                </div>

                <div>
                  <button
                    disabled={buttonLogin}
                    onClick={handleSubmit}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cidPrimaryGreen hover:bg-cidPrimaryGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cidPrimaryGreen"
                  >
                    <span hidden={loading}>Sign in</span>{' '}
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
      </Animated>
    </>
  );
};
