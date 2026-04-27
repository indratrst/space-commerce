interface SnapResult {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
}

interface SnapCallbacks {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

interface Snap {
  pay: (token: string, callbacks?: SnapCallbacks) => void;
  hide: () => void;
}

declare global {
  interface Window {
    snap: Snap;
  }
}

export {};
