export interface RAPI {
  status: 'success' | 'error' | 'failed';
  message: string;
  data?: any;
  error?: any;
}
