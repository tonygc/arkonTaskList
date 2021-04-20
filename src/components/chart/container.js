import { useState, useEffect } from 'react';
import {Presentational as ChartTasks} from './presentational'
import { useFetch } from '../reusables-components'
import { Redirect } from 'react-router-dom';

export const Container=(props)=>{

    /**
     * Componente para generar gráfica de 
     * conteo tareas finalizadas en un periodo de tiempo
     */

    /**
     * Variable de estado "dates" correspondiente al rango de fechas
     */
    const [dates, setDates]=useState({date1:"2021-04-15", date2:"2021-04-21"});

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
            method:"GET", 
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body:null
        }
    );
    
    /**
     * Variable de estado para regresar al listado de tareas
     */
    const [back, setBack]=useState(false);
    
    /**
     * Inicializar objetos fetch y tenerlos disponibles
     */
    const [ response, loading, hasError] = useFetch(url, setUrl, requestOptions);
    
    useEffect(()=>{
        if(response.success){
            //clearData();
        }
    },[response]);

    useEffect(()=>{
        setUrl(`http://localhost:3000/task/getchart/${dates.date1}/${dates.date2}`)
    },[dates]);

    const onChangeInput=(ev)=>{
        setDates({...dates,[ev.target.id]:ev.target.value});
    };

    const backToList=()=>{
        setBack(true);
    };
    

    return(
        <div>
            <ChartTasks
                response={response}
                loading={loading}
                error={hasError}
                onChangeInput={onChangeInput}
                dates={dates}
                data={response.data}
            />
        </div>
    )
}