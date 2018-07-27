import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk' 
import rootReducer from './reducers'

export default ((preloadedState) => {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware
    )
  )
})()