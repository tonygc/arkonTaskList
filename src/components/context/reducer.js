/**
 * Obtenemos de localStorage el objeto que contiene 
 * los minutos y segundos del temporizador de tareas.
 * Una vez obtenido se coloca en el contexto.
 */
let dataContext = localStorage.getItem("dataContextTasks")
  ? JSON.parse(localStorage.getItem("dataContextTasks"))
  : {
    stop:false,
    pause:false,
    data_user:{},
    data_task:null,
    value_timer:{
      minutes:0,
      seconds:0
    }
  };
 
export const initialState = dataContext;

/**
 * Reducer para actualizar el taskId si el usuario inicie una tarea.
 * Reducer para actualizar los minutos y segundos de la tarea cada vez que decremente el timer.
 */
export const TaskListReducer = (initialState, action) => {
  let updateObj={};
  switch (action.type) {
    case "UPDATE_STOP":
      updateObj={
        ...initialState,
          stop:action.payload
      };
      break;
    case "UPDATE_PAUSE":
      updateObj={
        ...initialState,
          pause:action.payload
      };
      break;
    case "UPDATE_TASKID":
      updateObj={
        ...initialState,
          data_task:action.payload
      };
      break;
    case "UPDATE_TIMER":
      updateObj = {
        ...initialState,
        value_timer: action.payload
        
      };
      break;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
  localStorage.setItem('dataContextTasks', JSON.stringify(updateObj));
  return updateObj;
};