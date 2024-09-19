import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

interface ToastState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

interface GlobalContextType {
  showToast: (message: string, severity?: ToastState['severity']) => void;
}

const ToastContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'info' });

  const showToast = useCallback((message: string, severity: ToastState['severity'] = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setToast({ ...toast, open: false });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={toast.severity}>
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
