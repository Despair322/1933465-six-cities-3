import { toast } from 'react-toastify';

export const ShowErrorToast = (message: string) => {
  toast.error(message);
};
