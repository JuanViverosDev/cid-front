import { useState } from 'react';

import { Box, Typography, Modal, Button } from '@mui/material';
//Components
import Swal from 'sweetalert2';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { forgotPass } from '../../../services/auth.service';
import { FORGOT_PASS_MODEL } from '../../../models/auth.model';

export const ModalForgotPass = () => {
  const { callEndpoint } = useFetchAndLoad();

  const [open, setOpen] = useState(false);
  const [emailUser, setEmailUser] = useState('');
  const [buttonRecover, setButtonRecover] = useState(false);

  const validEmail = new RegExp('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

    const body: FORGOT_PASS_MODEL = { emailUser };
    if (body.emailUser === '' || !validEmail.test) {
      showToast('warning', 'Please, check your information', 'You must register a valid email address');
    } else {
      try {
        const response = await callEndpoint(forgotPass(body));

        if (response.success) {
          showToast('success', 'Password sent successfully', 'Check your inbox');
          handleClose();
          setEmailUser('');
        } else {
          setButtonRecover(false);
          showToast('error', 'Oops, an error has occurred', 'The email address provided does not exist.');
        }
      } catch (error) {
        setButtonRecover(false);
      }
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Forgot your password?</Button>
      <Modal
        BackdropProps={{
          classes: {
            root: 'bg-blur',
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '1px solid grey',
            boxShadow: 4,
            borderRadius: '15px',
            zIndex: 1,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h3">
            Recover your password{' '}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Enter an email of a valid user to recover the password
          </Typography>
          <div className="mt-5 sm:flex sm:items-center">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-400 focus:border-green-400 sm:text-sm"
              onChange={(e) => setEmailUser(e.target.value)}
              //className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
              placeholder="you@example.com"
            />
            <button
              disabled={buttonRecover}
              onClick={handleSubmit}
              type="submit"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Recover
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
