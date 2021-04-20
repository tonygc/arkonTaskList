import { useState, useEffect } from 'react';
import {Presentational as TaskFormulario} from './presentational'
import { useFetch } from '../reusables-components'
import { Redirect } from 'react-router-dom';

export const Container=(props)=>{

    /**
     * Componente para agregar o modificar una tarea
     * En caso de ser una modificación, la información de la tarea se recibe en el parámetro "props.location.state"
     * Caso contrario, el valor de "props.location.state" estará vacío
     */
    const [dataTask, setDataTask]=useState({
        description:props.location.state?.description??"",
        duration_minutes:props.location.state?.duration_minutes??30,
        duration_seconds:props.location.state?.duration_seconds??0,
        id:props.location.state?.id??0,
        status:props.location.state?.status??0,
        status_duration:props.location.state?.status??1,
    });
    /**
     * Variable de estado "url" para settear la url del request externo (API)
     */
    const [url, setUrl]=useState("");
    /**
     * Variable de estado "requestOptions" para settear 
     * las opciones del request externo (API)
     */
    const [requestOptions, setRequestOptions]=useState(
        { 
            method:"POST", 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(dataTask)
        }
    );
    
    /**
     * Variable de estado para regresar al listado de tareas
     */
    const [back, setBack]=useState(false);
    
    /**
     * Método para limpiar los valores del estado que se muestran en la parte presentacional
     */
    const clearData=()=>{
        setDataTask({...dataTask,status:0,status_duration:1, description:"", duration_minutes:30, duration_seconds:0, id:0});
    };
    /**
     * Inicializar objetos fetch y tenerlos disponibles
     */
    const [ response, loading, hasError] = useFetch(url, setUrl, requestOptions);
    
    useEffect(()=>{
        /**
         * useeffect para monitorear el resultado al insertar o actualizar en el API.
         */
        if(response.success){
            clearData();
        }
    },[response]);

    useEffect(()=>{
        /**
         * useeffect para settear el valor del select status_duration al modifica los valores de duration_minutes y duration_seconds
         */
        if((dataTask.duration_minutes>=0 && dataTask.duration_minutes<30) || (Number(dataTask.duration_minutes)===30 && Number(dataTask.duration_seconds)===0)){
            setDataTask({...dataTask, status_duration:1});
        }else if(dataTask.duration_minutes>=30 && dataTask.duration_minutes<60){//|| (Number(dataTask.duration_minutes)===60 && Number(dataTask.duration_seconds)===0
            setDataTask({...dataTask, status_duration:2});
        }else if(dataTask.duration_minutes>=60){ //|| (Number(dataTask.duration_minutes)===60 && dataTask.duration_seconds>0)){
            setDataTask({...dataTask, status_duration:3});
        }
    },[dataTask.duration_minutes, dataTask.duration_seconds]);

    /**
     * Método para actualizar o insertar un task
     */
    const SubmitForm= (ev)=>{
        //Si no existe valor el la propiedad id creamos un nuevo task
        if(!dataTask.id){
            setRequestOptions({...requestOptions, method:"POST", body:JSON.stringify(dataTask)});
            //setting url to call api hook
            setUrl("http://localhost:3000/task/add");    
        }else{
            dataTask["duration_taken_minutes"]=0;
            dataTask["duration_taken_seconds"]=0;
            console.log(dataTask);
            setRequestOptions({...requestOptions, method:"PUT", body:JSON.stringify(dataTask)});
            //setting url to call api hook
            setUrl("http://localhost:3000/task/update");
        }
        
    };

    /**
     * El evento onChangeInput se encarga de actualizar 
     * la propiedad del estado que corresponda al id del input.
     * En éste ejemplo los 2 inputs de la parte presentational tendrán como valor en el campo "id" description y duration respectivamente.
     */
    const onChangeInput=(ev)=>{
        /**
         * Validacion para cantidad de minutos y segundos
         * Minutos máximos 120 de duración.
         */
        let updateState=true;
        if(ev.target.id==="duration_minutes" || ev.target.id==="duration_seconds" ){
            let valueNumber=Number(ev.target.value);
            if(ev.target.id==="duration_minutes"){
                if(valueNumber>=120 && (dataTask.duration_seconds>0)){
                    ev.target.value=119;
                }else if(valueNumber>120 && (dataTask.duration_seconds==="0" || dataTask.duration_seconds==="")){
                    ev.target.value=120;
                }else if(valueNumber<0){
                    ev.target.value=0;
                }
            }else{
                if(valueNumber>59){
                    ev.target.value=59;
                }else if(valueNumber<0){
                    ev.target.value=0;
                }else{
                    if(valueNumber>0 && dataTask.duration_minutes==="120"){
                        updateState=false;
                        setDataTask({...dataTask, duration_minutes: "119",
                                                    status_duration:3,
                                                   [ev.target.id]: ev.target.value});
                    }
                }
            }
        }else if(ev.target.name==="status_duration"){
            /**
             * Set default values in minutes and seconds fields 
             * based on status_duration field
             */
             updateState=false;
             
            switch(ev.target.value){
                default:
                    break;
                case 1:
                    setDataTask({...dataTask, duration_minutes: "30", duration_seconds:"0",
                                                   [ev.target.name]: ev.target.value});
                    break;
                case 2:
                    setDataTask({...dataTask, duration_minutes: "45", duration_seconds:"0",
                                                [ev.target.name]: ev.target.value});
                    break;
                case 3:
                    setDataTask({...dataTask, duration_minutes: "60", duration_seconds:"0",
                                                    [ev.target.name]: ev.target.value});
                        break;
            }
        }
        if(updateState)
            setDataTask({...dataTask, [ev.target.id]: ev.target.value});
    };

    /**
     * El evento backList se encarga de setear el valor de back a true para realizar el redireccionamiento al listado de tareas.
     */
    const backToList=()=>{
        setBack(true);
    };
    

    return(
        <div>
        {
            /**
             * Si el valor de "back" es true generamos el redireccionamiento
             * al listado de tareas
             */
        (back && 
                <Redirect to="/tarea/lista" push={true} />
        )}
        <TaskFormulario dataTask={dataTask} 
                        setDataTask={setDataTask} 
                        onChangeInput={onChangeInput} 
                        submitForm={SubmitForm}
                        backToList={backToList}
                        response={response}
                        error={hasError}
                        loading={loading}
                        />
        </div>
    )
};