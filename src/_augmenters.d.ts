import {IDispatch} from 'redux'

declare module 'redux' {
   export interface IDispatch<S> {
      <TResult>(asyncAction: (dispatch: IDispatch<S>, getState: () => S) => TResult): TResult;
   }
}
