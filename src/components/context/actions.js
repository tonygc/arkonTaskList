//import { useFetch } from '../customHooks/requestAPI'
//import { useState } from 'react'
//const ROOT_URL = 'http://localhost:3000';
export function UpdateTaskId(dispatch, payload){
  dispatch({ type: 'UPDATE_TASKID', payload });
}
export function UpdateTimer(dispatch, payload){
  dispatch({ type: 'UPDATE_TIMER', payload});
  
  //Si el tiempo se agota limpiar taskid
  //Si se presiono el boton de stop no limpiara taskid
  if(payload.minutes===0 && payload.seconds===0 && !payload.stop)
    UpdateTaskId(dispatch, null);
}
export function UpdatePause(dispatch, payload){
  dispatch({ type: 'UPDATE_PAUSE', payload });
}
export function UpdateStop(dispatch, payload){
  dispatch({ type: 'UPDATE_STOP', payload });
}
// export async function LoginUser(dispatch, loginPayload) {
//   const requestOptions = {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(loginPayload),
//   };
 
//   try {
//     dispatch({ type: 'REQUEST_LOGIN' });
//     let response = await fetch(`${ROOT_URL}/user/login`, requestOptions);
//     let data = await response.json();
//     console.log("data getted", data);
//     if (data.success) {
//       dispatch({ type: 'LOGIN_SUCCESS', payload: data.user });
//       localStorage.setItem('currentUser', JSON.stringify(data.user));
//       return data.user;
//     }
//     dispatch({ type: 'LOGIN_ERROR', error: data.error });
//     return;
//   } catch (error) {
//     dispatch({ type: 'LOGIN_ERROR', error:error.message });
//   }
// }
 
// export async function logout(dispatch) {
//   dispatch({ type: 'LOGOUT' });
//   localStorage.removeItem('currentUser');
//   localStorage.removeItem('token');
// }