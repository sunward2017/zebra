import { combineReducers } from 'redux'
import * as type from '../actions/type.js';

 const auth = (state={user:'',imgData:''},action)=>{
     switch(action.type){
          case type.ISLOGIN: 
            return {...state,user:action.user}
          default: return state   
     }
}


const load = (state=false,action)=>{
  switch(action.type){
    case type.REQUEST:
        return {state:action.category}
    default: 
        return  state   
  }
}

export default combineReducers({auth,load})