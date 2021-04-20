import React from "react";
import { initialState, TaskListReducer } from './reducer';
 
const TaskListStateContext = React.createContext();
const TaskListDispatchContext = React.createContext();

export function useTaskListState() {
    const context = React.useContext(TaskListStateContext);
    if (context === undefined) {
        throw new Error("useTaskListState must be used within a TaskListProvider");
    }

    return context;
}

export function useTaskListDispatch() {
    const context = React.useContext(TaskListDispatchContext);
    if (context === undefined) {
        throw new Error("useTaskListDispatch must be used within a TaskListProvider");
    }

    return context;
}

export const TaskListProvider = ({ children }) => {
    const [dataContext, dispatch] = React.useReducer(TaskListReducer, initialState);
   
    return (
      <TaskListStateContext.Provider value={dataContext}>
        <TaskListDispatchContext.Provider value={dispatch}>
          {children}
        </TaskListDispatchContext.Provider>
      </TaskListStateContext.Provider>
    );
  };