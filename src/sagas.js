/* @flow */
/* global Generator */

import { all, take, fork, put, call } from 'redux-saga/effects'

import type { Effect } from 'redux-saga'

// TODO: The `Effect` type is not actually defined. Because 'redux-saga' does
// not use @flow annotations, flow pretends that this import succeeds.
import type { CrudAction } from './actionTypes'

import {
  FETCH, FETCH_ONE, CREATE, UPDATE, DELETE, API_CALL, GARBAGE_COLLECT
} from './actionTypes'

// Generator type parameters are: Generator<+Yield,+Return,-Next>

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function* garbageCollector () {
  yield call(delay, 10 * 60 * 1000) // initial 10 minute delay
  for (; ;) {
    yield call(delay, 5 * 60 * 1000) // every 5 minutes thereafter
    yield put({ type: GARBAGE_COLLECT, meta: { now: Date.now() } })
  }
}

export const apiFetch = fetch =>
  function* _apiFetch (action: CrudAction<any>): Generator<Effect, void, any> {
    const { method, path, params, data, fetchConfig } = action.payload
    const { success, failure } = action.meta
    const meta = {
      ...action.meta,
      fetchTime: Date.now()
    }

    try {
      const response = yield call(fetch[method], path, { params, data, fetchConfig })
      yield put({ meta, type: success, payload: response })
    } catch (error) {
      yield put({ meta, type: failure, payload: error, error: true })
    }
  }

const watchFetch = fetch => function* _watchFetch () {
  while (true) {
    const action = yield take(FETCH)
    yield fork(apiFetch, fetch)(action)
  }
}

const watchFetchOne = fetch => function* _watchFetchOne () {
  while (true) {
    const action = yield take(FETCH_ONE)
    // yield fork(apiFetch, fetch, action)
    yield fork(apiFetch, fetch)(action)
  }
  // yield* takeEvery(FETCH_ONE, apiGeneric(apiClient))
}

const watchCreate = fetch => function* _watchCreate () {
  while (true) {
    const action = yield take(CREATE)
    // yield fork(apiFetch, fetch, action)
    yield fork(apiFetch, fetch)(action)
  }
  // yield* takeEvery(CREATE, apiGeneric(apiClient))
}

const watchUpdate = fetch => function* _watchUpdate () {
  while (true) {
    const action = yield take(UPDATE)
    // yield fork(apiFetch, fetch, action)
    yield fork(apiFetch, fetch)(action)
  }
  // yield* takeEvery(UPDATE, apiGeneric(apiClient))
}

const watchDelete = fetch => function* _watchDelete () {
  while (true) {
    const action = yield take(DELETE)
    // yield fork(apiFetch, fetch, action)
    yield fork(apiFetch, fetch)(action)
  }
  // yield* takeEvery(DELETE, apiGeneric(apiClient))
}

const watchApiCall = fetch => function* _watchApiCall () {
  while (true) {
    const action = yield take(API_CALL)
    // yield fork(apiFetch, fetch, action)
    yield fork(apiFetch, fetch)(action)
  }
  // yield* takeEvery(API_CALL, apiGeneric(apiClient))
}

export default function crudSaga (apiClient: Object) {
  return function* _crudSaga (): Generator<Effect, void, any> {
    yield all([
      fork(watchFetch(apiClient)),
      fork(watchFetchOne(apiClient)),
      fork(watchCreate(apiClient)),
      fork(watchUpdate(apiClient)),
      fork(watchDelete(apiClient)),
      fork(watchApiCall(apiClient)),
      fork(garbageCollector)
    ])
  }
}
