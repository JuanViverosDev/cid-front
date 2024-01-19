import { Fragment, useState } from "react";

import { XIcon } from "@heroicons/react/outline";
import { Dialog, Transition } from "@headlessui/react";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

// Slices
import { RootState } from "../redux/store";
import { toggleOpen } from "../redux/states/sidebarSlice";
import { AUTH } from "../models/";
import EMCALILOGO from "../assets/images/EMCALI-LOGO-INTERNO.png";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.sidebar.open);
  const sidebarMenu = useSelector(({ auth }: { auth: AUTH }) => auth.data.menu);
  const [toggleItemMenu /* setToggleItemMenu */] = useState(false);
  const [sectionSelected /* setSectionSelected */] = useState("");

  /* const handleMenuSection = (id: any) =>{ 
      setSectionSelected(id);
      setToggleItemMenu(!toggleItemMenu);
  } */

  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as='div'
          className='fixed inset-0 flex z-40 md:hidden'
          onClose={() => dispatch(toggleOpen())}
        >
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-600 bg-opacity-75' />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <div className='relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white'>
              <Transition.Child
                as={Fragment}
                enter='ease-in-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='absolute top-0 right-0 -mr-12 pt-2'>
                  <button
                    type='button'
                    className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                    onClick={() => dispatch(toggleOpen())}
                  >
                    <span className='sr-only'>Close sidebar</span>
                    <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
                  </button>
                </div>
              </Transition.Child>
              <div className='flex-shrink-0 flex justify-start items-center pl-10 px-4'>
                {/* <img
                  className='h-8 w-auto'
                  src={EMCALILOGO}
                  alt='CID - Control Interno Disciplinario'
                /> */}
            <p className="font-black text-4xl mt-4">CID</p>
              </div>

              <div className='mt-5 flex-1 h-0 overflow-y-auto'>
                <nav className='px-2 space-y-1'>
                  {sidebarMenu &&
                    sidebarMenu.map((item: any, idx: number) => (
                      <List
                        key={idx}
                        sx={{
                          width: "100%",
                          maxWidth: 360,
                          bgcolor: "background.paper",
                        }}
                        component='nav'
                        aria-labelledby='nested-list-subheader'
                        subheader={
                          <ListSubheader
                            className='bg-cidSecundaryOliveGreen'
                            component='div'
                            id='nested-list-subheader'
                          >
                            {item.categoryName}
                          </ListSubheader>
                        }
                      >
                        {item &&
                          item.categoryModule.map((module: any) => (
                            <div key={module.id}>
                              {module.permission[0]?.canView && (
                                <NavLink
                                  to={module.moduleUrl}
                                  className={({ isActive }) =>
                                    "flex items-center px-2 py-2 text-base font-cidFont rounded-md text-secondary" +
                                    (isActive
                                      ? " bg-redlight text-primary"
                                      : " text-secondary hover:bg-redlight")
                                  }
                                >
                                  <i className={module.moduleIcon}></i>
                                  <ListItemText primary={module.moduleName} />
                                </NavLink>
                              )}
                            </div>
                          ))}
                      </List>
                    ))}
                </nav>
              </div>
            </div>
          </Transition.Child>
          <div className='flex-shrink-0 w-14' aria-hidden='true'></div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className=' z-50 hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-lg shadow-black'>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className='flex flex-col flex-grow pt-1 bg-cidPrimaryWhite overflow-y-auto'>
          <div className='flex-shrink-0 flex justify-center items-center px-4'>
            {/* <img
              className='w-auto'
              style={{  height: 80 }}
              src={EMCALILOGO}
              alt='CID - Control Interno Disciplinario'
            /> */}
            <p className="font-black text-4xl mt-4">CID</p>
          </div>
          <div className='mt-5 flex-1 flex flex-col'>
            <nav className='flex-1 pb-4 space-y-1'>
              {sidebarMenu &&
                sidebarMenu.map((item: any, idx: number) => (
                  <List
                    key={item.id}
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      bgcolor: "background.paper",
                    }}
                    component='nav'
                    aria-labelledby='nested-list-subheader'
                    subheader={
                      <>
                        <ListSubheader
                          className='bg-cidSecundaryOliveGreen pr-0'
                          component='div'
                          id='nested-list-subheader'
                        >
                          <div className='grid grid-cols-6'>
                            <div className='col-span-5 '>{item.categoryName}</div>
                            <div>
                              {/* <button onClick={() => handleMenuSection(item.id) } >
                          {toggleItemMenu ? (<i className="uil uil-eye-slash"></i>) : (<i className="uil uil-eye"></i>)}
                          </button> */}
                            </div>
                          </div>
                        </ListSubheader>
                      </>
                    }
                  >
                    {item &&
                      item.categoryModule.map((module: any, index: any) => (
                        <div
                          key={module.id}
                          className={
                            toggleItemMenu && item.id === sectionSelected
                              ? "hidden "
                              : "block animate-fade"
                          }
                        >
                          {module.permission[0]?.canView && (
                            <NavLink
                              to={module.moduleUrl}
                              className={({ isActive }: any) =>
                                "flex items-start  px-2 py-2 text-base font-cidFont rounded-md " +
                                (isActive
                                  ? " bg-redlight text-primary font-bold"
                                  : " text-secondary hover:bg-redlight")
                              }
                            >
                              <i className={module.moduleIcon}></i>

                              <ListItemText
                                className={"pl-2"}
                                primary={module.moduleName}
                              />
                            </NavLink>
                          )}
                        </div>
                      ))}
                  </List>
                ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
