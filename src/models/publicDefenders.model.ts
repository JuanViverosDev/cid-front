export interface CREATE_PUBLIC_DEFENDER_MODEL {
  publicDefenderName: string;
  publicDefenderPhone: string;
  publicDefenderAddress: string;
  publicDefenderEmail: string;
  publicDefenderCompany: string;
  publicDefenderStartDate: string;
  publicDefenderEndDate: string;
  howManyProceedingsNumber: number;
  proceedingsNumbers: string;
  publicDefenderState: boolean;
}
export interface UPDATE_PUBLIC_DEFENDER_MODEL {
  publicDefenderName?: string;
  publicDefenderPhone?: string;
  publicDefenderAddress?: string;
  publicDefenderEmail?: string;
  publicDefenderCompany?: string;
  publicDefenderStartDate?: string;
  publicDefenderEndDate?: string;
  howManyProceedingsNumber?: number;
  proceedingsNumbers?: string;
  publicDefenderState: boolean;
}
export interface UPDATE_PUBLIC_DEFENDER_STATE_MODEL {
  publicDefenderState: boolean;
}
