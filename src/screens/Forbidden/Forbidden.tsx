import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AUTH } from '../../models/';

export const Forbidden = () => {
  const SIDEBAR = useSelector(({ auth }: { auth: AUTH }) => auth.data.menu);
  let navigate = useNavigate();

  const handleButtonReturnHome = () => {
    navigate(SIDEBAR ? SIDEBAR[0].menuModule[0].url : '/dashbord', {
      replace: true,
    });
  };
  return (
    <>
      <div className="h-screen-403 flex-1 pt-16 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex-shrink-0 flex justify-center">
            <a href="/" className="inline-flex">
              <span className="sr-only">Workflow</span>
              <img
                className="h-12 w-auto"
                src="https://www.cid.app/assets/images/Logo.svg"
                alt="cid.app - Haga sus compras internacionales fácil y rápida"
              />
            </a>
          </div>
          <div className="py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-cidPrimaryGreen uppercase tracking-wide">
                403 Access Denied
              </p>
              <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Your'e not permitted to see this.
              </h1>
              <p className="mt-2 text-base text-gray-500">The page you're trying to access has restricted access.</p>
              <div className="mt-6">
                <button
                  onClick={handleButtonReturnHome}
                  className="text-base font-medium text-cidPrimaryGreen hover:text-cidPrimaryGreen"
                >
                  Go back home<span aria-hidden="true"> &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
