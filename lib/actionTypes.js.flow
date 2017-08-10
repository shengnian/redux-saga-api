/* @flow */

export const FETCH : 'SHENGNIAN/API/FETCH' = 'SHENGNIAN/API/FETCH'
export const FETCH_SUCCESS : 'SHENGNIAN/API/FETCH_SUCCESS' = 'SHENGNIAN/API/FETCH_SUCCESS'
export const FETCH_ERROR : 'SHENGNIAN/API/FETCH_ERROR' = 'SHENGNIAN/API/FETCH_ERROR'
export const FETCH_ONE : 'SHENGNIAN/API/FETCH_ONE' = 'SHENGNIAN/API/FETCH_ONE'
export const FETCH_ONE_SUCCESS : 'SHENGNIAN/API/FETCH_ONE_SUCCESS' = 'SHENGNIAN/API/FETCH_ONE_SUCCESS'
export const FETCH_ONE_ERROR : 'SHENGNIAN/API/FETCH_ONE_ERROR' = 'SHENGNIAN/API/FETCH_ONE_ERROR'
export const CREATE : 'SHENGNIAN/API/CREATE' = 'SHENGNIAN/API/CREATE'
export const CREATE_SUCCESS : 'SHENGNIAN/API/CREATE_SUCCESS' = 'SHENGNIAN/API/CREATE_SUCCESS'
export const CREATE_ERROR : 'SHENGNIAN/API/CREATE_ERROR' = 'SHENGNIAN/API/CREATE_ERROR'
export const UPDATE : 'SHENGNIAN/API/UPDATE' = 'SHENGNIAN/API/UPDATE'
export const UPDATE_SUCCESS : 'SHENGNIAN/API/UPDATE_SUCCESS' = 'SHENGNIAN/API/UPDATE_SUCCESS'
export const UPDATE_ERROR : 'SHENGNIAN/API/UPDATE_ERROR' = 'SHENGNIAN/API/UPDATE_ERROR'
export const DELETE : 'SHENGNIAN/API/DELETE' = 'SHENGNIAN/API/DELETE'
export const DELETE_SUCCESS : 'SHENGNIAN/API/DELETE_SUCCESS' = 'SHENGNIAN/API/DELETE_SUCCESS'
export const DELETE_ERROR : 'SHENGNIAN/API/DELETE_ERROR' = 'SHENGNIAN/API/DELETE_ERROR'
export const DELETE_BUCKET : 'SHENGNIAN/API/DELETE_BUCKET' = 'SHENGNIAN/API/DELETE_BUCKET'
export const DELETE_BUCKET_SUCCESS : 'SHENGNIAN/API/DELETE_BUCKET_SUCCESS' = 'SHENGNIAN/API/DELETE_BUCKET_SUCCESS'
export const DELETE_BUCKET_ERROR : 'SHENGNIAN/API/DELETE_BUCKET_ERROR' = 'SHENGNIAN/API/DELETE_BUCKET_ERROR'
export const CLEAR_ACTION_STATUS : 'SHENGNIAN/API/CLEAR_ACTION_STATUS' = 'SHENGNIAN/API/CLEAR_ACTION_STATUS'
export const API_CALL : 'SHENGNIAN/API/API_CALL' = 'SHENGNIAN/API/API_CALL'
export const GARBAGE_COLLECT : 'SHENGNIAN/API/GARBAGE_COLLECT' = 'SHENGNIAN/API/GARBAGE_COLLECT'
export const CLEAR_MODEL_DATA : 'SHENGNIAN/API/CLEAR_MODEL_DATA' = 'SHENGNIAN/API/CLEAR_MODEL_DATA'


export type ID = string | number
export type Method = 'get' | 'post' | 'put' | 'delete'
export type Model = string

export type Meta = {
  success: string,
  failure: string,
  params?: Object,
  model: Model,
  id?: ID,
  fetchTime?: number,
}

export type CrudAction<T> = {
  type: typeof FETCH
    | typeof FETCH_ONE | typeof CREATE | typeof UPDATE | typeof DELETE | typeof API_CALL,
  meta: Meta,
  payload: {
    method: Method,
    path: string,
    data?: T,
    params: Object,
    fetchConfig?: Object,
  },
}

export type Success<T:{ id: ID }> = {
  type: typeof FETCH_SUCCESS | typeof FETCH_ONE_SUCCESS |
    typeof CREATE_SUCCESS | typeof UPDATE_SUCCESS | typeof DELETE_SUCCESS,
  meta: Meta,
  payload: T | {
    content: T,
  },
  error?: boolean,
}

export type Failure = {
  type: typeof FETCH_ERROR | typeof FETCH_ONE_ERROR |
    typeof CREATE_ERROR | typeof UPDATE_ERROR | typeof DELETE_ERROR,
  meta: Meta,
  payload: Error,
  error: true,
}

export type ClearActionStatus = {
  type: typeof CLEAR_ACTION_STATUS,
  payload: {
    model: Model,
    action: 'create' | 'update' | 'delete',
  }
}

export type GarbageCollect = {
  type: typeof GARBAGE_COLLECT,
  meta: {
    now: number,
  }
}

export type ClearModelDataAction = {
  type: typeof CLEAR_MODEL_DATA,
  payload: {
    model: Model,
  }
}


export type Action = | ClearActionStatus | CrudAction<any> | Success<any> | Failure
