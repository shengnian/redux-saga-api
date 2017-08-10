/* eslint no-case-declarations: 0 */
/* eslint-disable no-unused-vars */

import isEqual from 'lodash.isequal'
import {
  FETCH, FETCH_SUCCESS, FETCH_ERROR,
  FETCH_ONE, FETCH_ONE_SUCCESS, FETCH_ONE_ERROR,
  CREATE, CREATE_SUCCESS, CREATE_ERROR,
  UPDATE, UPDATE_SUCCESS, UPDATE_ERROR,
  DELETE, DELETE_SUCCESS, DELETE_ERROR,
  DELETE_BUCKET, DELETE_BUCKET_SUCCESS, DELETE_BUCKET_ERROR,
  CLEAR_ACTION_STATUS, API_CALL, GARBAGE_COLLECT,
  CLEAR_MODEL_DATA
} from './actionTypes'

/*
 * SECTION: initial states
 */

const byIdInitialState = {}

const collectionInitialState = {
  params: {},
  otherInfo: {},
  ids: [],
  fetchTime: null,
  error: null
}

const collectionsInitialState = []

const actionStatusInitialState = {
  create: {},
  update: {},
  delete: {}
}

export const modelInitialState = {
  byId: byIdInitialState,
  collections: collectionsInitialState,
  actionStatus: actionStatusInitialState
}

// holds a number of models, each of which are strucured like modelInitialState
const initialState = {}

/*
 * SECTION: reducers
 */

// server data is canonical, so blast away the old data
export const fetchByIdReducer = (state = byIdInitialState, action) => {
  const id = action.meta ? action.meta.id : undefined
  const ids = action.meta ? action.meta.ids : []
  const idName = action.meta ? action.meta.idName : 'id'
  let newState // should only be used once per invocation
  switch (action.type) {
    case FETCH_SUCCESS:
      const data = {}
      const payload = ('content' in action.payload) ? action.payload.content : action.payload
      payload.forEach((record) => {
        data[record[idName]] = {
          fetchTime: action.meta.fetchTime,
          error: null,
          record
        }
      })
      return Object.assign({}, state, data)
    case FETCH_ONE:
      return Object.assign({}, state, {
        [id]: {
          fetchTime: 0,
          error: null,
          record: null
        }
      })
    case FETCH_ONE_SUCCESS:
      return Object.assign({}, state, {
        [id]: {
          fetchTime: action.meta.fetchTime,
          error: null,
          record: action.payload
        }
      })
    case FETCH_ONE_ERROR:
      return Object.assign({}, state, {
        [id]: {
          fetchTime: action.meta.fetchTime,
          error: action.payload,
          record: null
        }
      })
    case CREATE_SUCCESS: {
      return Object.assign({}, state, {
        [action.payload[idName]]: {
          fetchTime: action.meta.fetchTime,
          error: null,
          record: action.payload
        }
      })
    }
    case UPDATE:
      return Object.assign({}, state, {
        [id]: {
          fetchTime: 0,
          error: state[id].error,
          record: state[id].record
        }
      })
    case UPDATE_SUCCESS:
      return Object.assign({}, state, {
        [id]: {
          fetchTime: action.meta.fetchTime,
          error: null,
          record: action.payload
        }
      })
    case DELETE_SUCCESS:
      newState = Object.assign({}, state)
      delete newState[id]
      return newState
    case DELETE_BUCKET_SUCCESS: {
      newState = Object.assign({}, state)
      for (let i = 0, len = ids.length; i < len; i += 1) {
        delete newState[ids[i]]
      }
      return newState
    }
    case GARBAGE_COLLECT:
      const tenMinutesAgo = action.meta.now - (10 * 60 * 1000)
      newState = Object.assign({}, state)
      Object.keys(state)
        .filter(key => newState[key].fetchTime < tenMinutesAgo)
        .forEach((key) => {
          delete newState[key]
        })
      return newState
    default:
      return state
  }
}

/*
 * Note: fetchTime of null means "needs fetch"
 */
export const fetchCollectionReducer = (state = collectionInitialState, action) => {
  const idName = action.meta ? action.meta.idName : 'id'
  switch (action.type) {
    case FETCH:
      return Object.assign({}, state, {
        params: action.meta.params,
        fetchTime: 0,
        error: null
      })
    case FETCH_SUCCESS: {
      const originalPayload = action.payload || {}
      const payload = ('content' in action.payload) ? originalPayload.content : action.payload
      const otherInfo = ('content' in action.payload) ? originalPayload : {}
      delete otherInfo.content
      const ids = payload.map(elt => (elt[idName]))
      return Object.assign({}, state, {
        params: action.meta.params,
        ids,
        otherInfo,
        error: null,
        fetchTime: action.meta.fetchTime
      })
    }
    case FETCH_ERROR:
      return Object.assign({}, state, {
        params: action.meta.params,
        error: action.payload
      })
    default:
      return state
  }
}

/* eslint-disable no-shadow, no-use-before-define */
export const fetchCollectionsReducer = (
  state = collectionsInitialState, action,
  { collectionReducer = fetchCollectionReducer } = {}) => {
  /* eslint-enable no-shadow, no-use-before-define */
  switch (action.type) {
    case FETCH:
    case FETCH_SUCCESS:
    case FETCH_ERROR: {
      // create the collection for the given params if needed
      // entry will be undefined or [index, existingCollection]
      if (action.meta.params === undefined) {
        return state
      }
      // TODO non-cache the collections
      // const index = state.findIndex(coll => (
      //   isEqual(coll.params, action.meta.params)
      // ))
      // if (index === -1) {
      //   return state.concat([collectionReducer(undefined, action)])
      // }

      // return state.slice(0, index)
      //   .concat([collectionReducer(state[index], action)])
      //   .concat(state.slice(index + 1))
      const newState = []
      newState.push(collectionReducer(undefined, action))
      return newState
    }
    case CREATE_SUCCESS:
    case DELETE_SUCCESS:
    case DELETE_BUCKET_SUCCESS:
      // set fetchTime on all entries to null
      return state.map((item, idx) => (
        Object.assign({}, item, { fetchTime: null })
      ))
    case GARBAGE_COLLECT:
      const tenMinutesAgo = action.meta.now - (10 * 60 * 1000)
      return state.filter(collection => (
        collection.fetchTime > tenMinutesAgo ||
        collection.fetchTime === null
      ))
    default:
      return state
  }
}

export const fetchActionStatusReducer = (state = actionStatusInitialState, action) => {
  const idName = action.meta ? action.meta.idName : 'id'
  switch (action.type) {
    case CLEAR_ACTION_STATUS:
      return Object.assign({}, state, {
        [action.payload.action]: {}
      })
    case CREATE: {
      return Object.assign({}, state, {
        create: {
          pending: true,
          id: null
        }
      })
    }
    case CREATE_SUCCESS:
    case CREATE_ERROR: {
      return Object.assign({}, state, {
        create: {
          pending: false,
          id: action.payload[idName],
          isSuccess: !action.error,
          payload: action.payload
        }
      })
    }
    case UPDATE:
      return Object.assign({}, state, {
        update: {
          pending: true,
          id: action.meta.id
        }
      })
    case UPDATE_SUCCESS:
    case UPDATE_ERROR:
      return Object.assign({}, state, {
        update: {
          pending: false,
          id: action.meta.id,
          isSuccess: !action.error,
          payload: action.payload
        }
      })
    case DELETE:
      return Object.assign({}, state, {
        delete: {
          pending: true,
          id: action.meta.id
        }
      })
    case DELETE_SUCCESS:
    case DELETE_ERROR:
      return Object.assign({}, state, {
        delete: {
          pending: false,
          id: action.meta.id,
          isSuccess: !action.error,
          payload: action.payload // probably null...
        }
      })
    case DELETE_BUCKET:
      return Object.assign({}, state, {
        delete: {
          pending: true,
          id: action.meta.ids
        }
      })
    case DELETE_BUCKET_SUCCESS:
    case DELETE_BUCKET_ERROR:
      return Object.assign({}, state, {
        delete: {
          pending: false,
          id: action.meta.ids,
          isSuccess: !action.error,
          payload: action.payload // probably null...
        }
      })
    default:
      return state
  }
}

/* eslint-disable no-shadow, no-use-before-define */
function modelReducer (
  state = initialState,
  action,
  {
    actionStatusReducer = fetchActionStatusReducer,
    byIdReducer = fetchByIdReducer,
    collectionsReducer = fetchCollectionsReducer
  } = {}) {
  /* eslint-enable no-shadow, no-use-before-define */
  // const id = action.meta ? action.meta.id : undefined
  switch (action.type) {
    case GARBAGE_COLLECT:
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action),
        collections: collectionsReducer(state.collections, action)
      })
    case CLEAR_MODEL_DATA:
      return Object.assign({}, modelInitialState)
    case CLEAR_ACTION_STATUS:
      return Object.assign({}, state, {
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    case FETCH:
    case FETCH_SUCCESS:
    case FETCH_ERROR: {
      // !!!Important byIdReducer must execution before collectionsReducer.
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action),
        collections: collectionsReducer(state.collections, action)
      })
    }
    case FETCH_ONE:
    case FETCH_ONE_SUCCESS:
    case FETCH_ONE_ERROR:
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action)
      })
    case CREATE: {
      return Object.assign({}, state, {
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    }
    case CREATE_SUCCESS: {
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action),
        collections: collectionsReducer(state.collections, action),
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    }
    case CREATE_ERROR:
      return Object.assign({}, state, {
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    case UPDATE:
    case UPDATE_SUCCESS:
    case UPDATE_ERROR:
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action),
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    case DELETE:
    case DELETE_SUCCESS:
    case DELETE_ERROR: {
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action),
        collections: collectionsReducer(state.collections, action),
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    }
    case DELETE_BUCKET:
    case DELETE_BUCKET_SUCCESS:
    case DELETE_BUCKET_ERROR: {
      return Object.assign({}, state, {
        byId: byIdReducer(state.byId, action),
        collections: collectionsReducer(state.collections, action),
        actionStatus: actionStatusReducer(state.actionStatus, action)
      })
    }
    default:
      return state
  }
}

/* eslint-disable no-shadow, no-use-before-define */
export default function crudReducer (
  state = initialState,
  action,
  {
    actionStatusReducer = fetchActionStatusReducer,
    byIdReducer = fetchByIdReducer,
    collectionsReducer = fetchCollectionsReducer
  } = {}) {
  /* eslint-enable no-shadow, no-use-before-define */
  switch (action.type) {
    case GARBAGE_COLLECT: {
      return Object.keys(state).reduce((newState, model) => (
        Object.assign({}, newState, {
          [model]: modelReducer(state[model], action,
            {
              actionStatusReducer,
              byIdReducer,
              collectionsReducer
            })
        })
      ), {})
    }
    case CLEAR_MODEL_DATA:
    case CLEAR_ACTION_STATUS:
    case FETCH:
    case FETCH_SUCCESS:
    case FETCH_ERROR:
    case FETCH_ONE:
    case FETCH_ONE_SUCCESS:
    case FETCH_ONE_ERROR:
    case CREATE:
    case CREATE_SUCCESS:
    case CREATE_ERROR:
    case UPDATE:
    case UPDATE_SUCCESS:
    case UPDATE_ERROR:
    case DELETE:
    case DELETE_SUCCESS:
    case DELETE_ERROR:
    case DELETE_BUCKET:
    case DELETE_BUCKET_SUCCESS:
    case DELETE_BUCKET_ERROR:
    {
      const model = (action.meta && action.meta.model) || action.payload.model
      return Object.assign({}, state, {
        [model]: modelReducer(state[model], action, {
          actionStatusReducer,
          byIdReducer,
          collectionsReducer
        })
      })
    }
    default:
      return state
  }
}
