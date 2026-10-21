import { toast } from 'react-toastify';

export const showErrorToast = (message: string) => {
  toast.error(message);
};
