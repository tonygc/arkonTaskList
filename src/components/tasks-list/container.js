import { useState, useEffect, useMemo } from 'react';

import {Redirect} from 'react-router-dom';
import {Presentational as BrowseTasks} from './presentational'
import { useFetch } from '../reusables-components/custom-hooks/requestAPI'
import { useTaskListDispatch, useTaskListState, UpdateTaskId, UpdateTimer, UpdatePause, UpdateStop } from '../context'

/* 
    - Contenedor de listado de tareas
*/
const Container=()=>{
    //Acceder al contexto;
    const context = useTaskListState();
    console.log("context", context);
    //Acceder a dispatch del contexto;
    const dispatch = useTaskListDispatch();

    useMemo(()=>{
        //  console.log("useMemo");
    },[]);

    /**ESTADO */
    //variable para colocar la información de la tarea en curso
    const [ itemTask, setItemTask ] = useState(context.data_task);
    //variable para colocar la información de la tarea a editar
    const [ editTask, setEditTask ] = useState(null);
    //variable para redireccionar a pantalla de mantenimiento de tareas
    const [addTask, setAddTask]=useState(false);
    //variable para redireccionar a pantalla de grafica
    const [clickChart, setClickChart]=useState(false);
    /**
     * Variable para minutos y segundos del temporizador
     * Se colocan los valores de minutos y segundos almacenados en el contexto.
     * Si son mayores a cero, se muestra el temporizador y el decremento
     * */
    const [ minutes, setMinutes ] = useState(context.value_timer.minutes);
    const [ seconds, setSeconds ] =  useState(context.value_timer.seconds);

    /**
     * Método finishTask.
     * Calcula la cantidad de minutos y segundos tomados para finalizar la tarea.
     * Coloca el estatus de duración.
     *      Si la cantidad minutos tomados es '<=30' es duración corta. (1)
     *      Si la cantidad minutos tomados es '>30' y '<=60' es duración media. (2)
     *      Si la cantidad minutos tomados es '>60' es duración larga. (3)
     */
    const finishTask=(timeFinished)=>{
        let minutes=Number(context.value_timer.minutes);
        let seconds=Number(context.value_timer.seconds);
        console.log("timeFinished",timeFinished);
        if(timeFinished){
            /**
             * si el parámetro 'timeFinished' no es vacío el tiempo se agotó.
             * igualamos los minutos y segundos tomados a los minutos y segundos estimados de la tarea
             */
            minutes=Number(itemTask.duration_minutes);
            seconds=Number(itemTask.duration_seconds);
        }else{
            /**
             * obtener total de segundos tomados para realizar la tarea.
             * obtener total de segundos estimados para realizar la tarea.
             */
            let totalSecondsTaken=(minutes*60)+seconds;
            let totalSecondsEstimated=(Number(itemTask.duration_minutes)*60)+Number(itemTask.duration_seconds);

            /**
             * obtenemos el total de segundos de diferencia entre
             * los estimados y los ejecutados
             */
            let totalSecondsDuration=totalSecondsEstimated-totalSecondsTaken;

            /**
             * obtener el total de segundos con (mod) 60
             * y así obtener el sobrante.
             */
            seconds=totalSecondsDuration % 60;
            /**
             * obtener total de minutos dividiendo entre 60 
             * y eliminando la parte decimal con operador bitwise
             */
            minutes=~~(totalSecondsDuration / 60);
            setMinutes(0);
            setSeconds(0);
        }
        // let status=0;
        // if(minutes<30){
        //     status=1;
        // }if((minutes===30 && seconds>0) || (minutes>30 && minutes<60) ){
        //     status=2;
        // }if((minutes===60 && seconds>0) || minutes>60){
        //     status=3;
        // }
        let objTask={
            status:0,
            status_duration:itemTask.status_duration,
            duration_taken_minutes:minutes,
            duration_taken_seconds:seconds,
            id:itemTask.id,
            duration_minutes:itemTask.duration_minutes,
            duration_seconds:itemTask.duration_seconds,
            description:itemTask.description
        }
        setRequestOptions({...requestOptions
            ,method:"PUT"
            ,body:JSON.stringify(objTask)
        });
        setUrl("http://localhost:3000/task/update");
        setItemTask(null);
        UpdateTaskId(dispatch,null);
        UpdateTimer(dispatch,{minutes:0,seconds:0});
        UpdatePause(dispatch,false);
        UpdateStop(dispatch,false);
    };

    /**
     * Hook useEffect para generar el intervalo de timer.
     */
    useEffect(()=>{
        let myInterval = setInterval(() => {
                /**
                 * Pause o Stop limpian el intervalo y no se evalúa ningúna condición
                 */
                if(context.pause || context.stop){
                    clearInterval(myInterval);
                    return;
                }
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                    //Actualizar valores en el contexto
                    UpdateTimer(dispatch, { minutes, seconds:seconds-1}); 
                }
                if(!itemTask)
                    return;
                if(seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(myInterval)
                        /**
                         * al acabarse el tiempo invocamos el métofo finishTask
                         */
                        finishTask(true);
                        
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                        UpdateTimer(dispatch, { minutes:minutes-1, seconds:59}); 
                    }
                }
                
            }, 1000)
            return ()=> {
                clearInterval(myInterval);
            };
    },[minutes, seconds, context.pause, context.stop]);
    /**
     * Variable de estado "url" para settear la url del request externo (API)
     */
     const [url, setUrl]=useState("http://localhost:3000/task/get");
     /**
      * Variable de estado "requestOptions" para settear 
      * las opciones del request externo (API)
      */
     const [requestOptions, setRequestOptions]=useState(
         { 
             method:"GET", 
             headers: {
                 'Accept': 'application/json, text/plain, */*',
                 'Content-Type': 'application/json'
             },
             body:null
         }
     );
    const [response, loading, hasError] = useFetch(url, setUrl, requestOptions);
    
    //Evento de botón Agregar Tarea
    const clickAddTask=()=>{
        setEditTask(null)
        //Setear addTask a true
        setAddTask(true);
    };
    //Cuando addTask es igual a true fue presionado el botón de agregar tarea.
    //Cuando editTask no es vacío fue presionado el botón de editar tarea.
    //Redireccionar a url de mantenimiento de tareas
    if (addTask || editTask) {
        return <Redirect 
            to={{
                pathname:"/tarea",
                state: editTask
            }}
            push={true} />;
    }
    if (clickChart) {
        return <Redirect 
            to={{
                pathname:"/tarea/grafica",
                state: editTask
            }}
            push={true} />;
    }

    /**
     * Método para editar una tarea
     */
    const clickEditTask=(item)=>{
        //settear el valor de la tarea a editar en el estado
        setEditTask(item);
    };
    
    /**
     * Método para iniciar timer
     */
    const startTimer=()=>{
        if(itemTask){
            setMinutes(itemTask.duration_minutes);  
            setSeconds(itemTask.duration_seconds);
            UpdateTaskId(dispatch, itemTask);   
        }
        setRequestOptions(
            { 
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                method:"GET", 
                body:null
            }
        );
        setUrl("http://localhost:3000/task/get");
    };

    /**
     * Actualizar task en server.
     * Colocar estatus "En progreso"
     */
    const updateTaskInProgress=(item)=>{
        if(!context.data_task){
            item.status=2;
            console.log(item);
            setItemTask(item);
            console.log("itemTask11->", itemTask);
            setRequestOptions({...requestOptions
                ,method:"PUT"
                ,body:JSON.stringify(item)
            });
            setUrl("http://localhost:3000/task/update");
        }
    }

    /**
     * Reiniciar cronómetro
     */
    const restartTimer=()=>{
        setMinutes(context.data_task.duration_minutes);
        setSeconds(context.data_task.duration_seconds);
    };
    /**
     * Pausar/Reanudar cronómetro (acción pausa)
     */
    const updatePauseTimer=(pause)=>{
        UpdatePause(dispatch,pause);
    };

    /**
     * Pausar/Reanudar cronómetro (acción stop)
     */
     const updateStopTimer=(stop)=>{
        UpdateStop(dispatch,stop);
        if(stop)
        {
            setMinutes(0);
            setSeconds(0);
            UpdateTimer(dispatch,{minutes:0, seconds:0, stop:true});
        }else{
            setMinutes(context.data_task.duration_minutes);
            setSeconds(context.data_task.duration_seconds);
        }
    };

    /**
     * Evento para insertar información demo a lo largo de la semana
     */
    const insertDemo=()=>{
        setUrl("http://localhost:3000/task/demo");
    }

    return(
        <div>
        {(response &&
            <BrowseTasks 
            setUrl={setUrl}
                insertDemo={insertDemo}
                rows={response.data} 
                loading={loading}
                hasError={hasError}
                clickAddTask={clickAddTask} 
                clickEditTask={clickEditTask}
                restartTimer={restartTimer}
                startTimer={startTimer} 
                updateTaskInProgress={updateTaskInProgress}
                updatePauseTimer={updatePauseTimer}
                updateStopTimer={updateStopTimer}
                pause={context.pause}
                stop={context.stop}
                minutes={minutes}
                seconds={seconds}
                itemTask={itemTask}
                setItemTask={setItemTask}
                response={response}
                requestOptions={requestOptions}
                finishTask={finishTask}
                setClickChart={setClickChart}
                />
        )}
        </div>
    )
};
export default Container;