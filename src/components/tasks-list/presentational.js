import React, {useState, useEffect} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { Grid, Button, Box, ButtonGroup } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import RestoreIcon from '@material-ui/icons/Restore';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TimelineIcon from '@material-ui/icons/Timeline';

import { CustomButton, GreenButton, DeepOrangeButton, ConfirmationDialog, EditTextBinded, SelectBinded, BackdropLoading,
     MessageError, MessageSuccess, DarkTableRow, DarkTableCell, ManagePagination, TablePaginationCustom, SortableTableState, SortableTableHead } 
     from '../reusables-components'

/**Componente presentacional 
 * Contiene elementos ui, no accesa directamente al estado
*/  
export const Presentational=(
    {
        rows, 
        requestOptions,
        response, 
        clickAddTask, 
        clickEditTask, 
        loading, 
        hasError, 
        setItemTask, 
        minutes, 
        seconds,
        startTimer,
        restartTimer,
        updatePauseTimer,
        updateStopTimer,
        updateTaskInProgress,
        itemTask,
        stop,
        pause,
        finishTask,
        setClickChart,
        insertDemo,
        setUrl})=>{
    
    //Componente para administrar el paginado de la tabla
    const {page, rowsPerPage, handleChangeRowsPerPage, handleChangePage} = ManagePagination();

    //Componente para administrar el ordenamiento de la tabla
    const { order, setOrder, orderBy, setOrderBy, 
        handleRequestSort, stableSort, getComparator } = SortableTableState("desc", "UPDATEDATE");

    //Array de configuración de header ordenable de tabla
    const headCells = [
        { id: 'description', numeric: false, disablePadding: false, label: 'Tarea', align:'left' },
        { id: 'duration_minutes', numeric: false, disablePadding: false, label: 'Duración', align:'right' },
        { id: 'status_duration', numeric: true, disablePadding: false, label: 'Clasificación', align:'right' },
        { id: 'duration_taken_minutes', numeric: false, disablePadding: false, label: 'Tiempo invertido', align:'center' },
        { id: 'status', numeric: true, disablePadding: false, label: 'Estatus', align:'right' },
        { id: 'UPDATEDATE', numeric: false, disablePadding: false, label: 'Fecha de Actualización', align:'right' },
        { id: 'btn1', numeric: false, disablePadding: false, label: '' },
        { id: 'btn2', numeric: false, disablePadding: false, label: '' },
      ];

    /**
     * Actualizar status "en proceso" de tarea en el servidor
     * Colocar la página 1 y ordenar descendentemente por estatus
     * */
    const inProccess=(item)=>{
        updateTaskInProgress(item);
        
    };

    /**
     * Evaluar si se actualizó una task en el server con éxito
     * */
    useEffect(()=>{
        /**
         * Validar que response no esté vacío y que el metodo de request haya sido "PUT"
         */
        if(requestOptions.method==="PUT" && response.success){
            if(response.success===true){
                //Iniciar cronómetro
                startTimer();
                //Seleccionar primer página de tabla
                handleChangePage(null,0);
                //ordernar por estatus descendente tabla de tareas
                setOrder("desc");
                setOrderBy("UPDATEDATE");
            }else{
                //limpiar estado itemTask 
                setItemTask(null);
            }
        }else if(response===true){
            setUrl("http://localhost:3000/task/get");
        }
    },[response]);
    return(
        <div>
        {(minutes!==0 || seconds!==0 || stop) &&
        <Box>
            <Box display="flex" justifyContent="flex-end">
                <Typography variant="h1"> {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Typography> 
            </Box>
            <Box display="flex" justifyContent="flex-end">
                <ButtonGroup disableElevation variant="contained">
                    {!pause && !stop && CustomButton(<RestoreIcon />, "", "Reiniciar cronómetro", "lightGray", "black", ()=>restartTimer(), loading, "small", false )}
                    {!pause && !stop && CustomButton(<PauseIcon />, "", "Pausar cronómetro", "gray", "black", ()=>updatePauseTimer(true), loading, "small", false )}
                    {!pause && !stop && CustomButton(<StopIcon />, "", "Detener cronómetro", "black", "white", ()=>updateStopTimer(true), loading, "small", false )}
                    {pause && <Button onClick={()=>updatePauseTimer(false)} color="primary" size="small" title="Iniciar cronómetro"><PlayArrowIcon /></Button>}
                    {stop && <Button onClick={()=>updateStopTimer(false)} color="primary" size="small" title="Iniciar cronómetro"><PlayArrowIcon /></Button>}
                </ButtonGroup>
            </Box>
        </Box>
        }
        {BackdropLoading(loading)}
        <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="h4">
                    Tasks List
                </Typography>
            </Grid>
            <Grid lg={2} md={3} sm={4} xs={12} item>
                <Box mb={1}>{DeepOrangeButton("Gráfica", "Ir a gráfica de productividad",()=> {setClickChart(true)}, <EqualizerIcon /> ,loading)}</Box>
            </Grid>
            <Grid lg={8} md={6} sm={4} xs={"auto"} item></Grid>
            <Grid lg={2} md={3} sm={4} xs={12} item>
                <Box mb={1}>{DeepOrangeButton("Nueva tarea", "Agregar nueva tarea", clickAddTask, <AddBoxIcon /> ,loading)}</Box>
            </Grid>
            <Grid lg={2} md={3} sm={4} xs={12} item>
                <Box mb={1}>{GreenButton("Tareas Aleatorias", "Cargar información demo...",()=> {insertDemo()}, <TimelineIcon /> ,loading)}</Box>
            </Grid>
            <Grid lg={10} md={6} sm={4} xs={"auto"} item></Grid>
            <Grid item xs={12}>
                {MessageError("",hasError)}
                {response &&
                    (response.success===false &&
                    /**
                     * Mostrar mensaje de error si la propiedad "response.error" es diferente a vacío
                     */
                    MessageError(response.error,!response.success))
                }
            </Grid>
            <Grid item lg={1} md={1} sm={"auto"} xs={"auto"}></Grid>
            <Grid item lg={10} md={10} sm={12} xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <SortableTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                            />
                        <TableBody>
                        {(rows &&
                        /**
                         * rows es un array que contiene los registros a mostrar en la tabla
                         * se hace un slice al array para controlar el paginado seleccionado por el usuario
                         */
                        stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((item) => (
                            /**
                             * Si el estatus de la tarea es "Finalizado"(0) el backgrund será verde.
                             * Si es "En progreso"(2) será amarillo.
                             */
                            <DarkTableRow key={item.id} style={item.status === 2 ? {background:"rgb(255 255 184)"} : (item.status===0 ? {background:"#d7f9d7"} :{})}>
                                <DarkTableCell>{item.description}</DarkTableCell>
                                <DarkTableCell align="right">{`${
                                    (item.duration_minutes < 10 ? '0' :'') +
                                    item.duration_minutes
                                    }:${
                                        (item.duration_seconds < 10 ? '0' :'') +
                                    item.duration_seconds
                                    }`}</DarkTableCell>
                                {/* <DarkTableCell>{item.email}</DarkTableCell>
                                <DarkTableCell>{item.phone}</DarkTableCell>*/}
                                
                                <DarkTableCell align="right"> {
                                {
                                    1: "Corta",
                                    2: "Media",
                                    3: "Larga",
                                    }[ item.status_duration ]
                                }
                                </DarkTableCell> 
                                
                                <DarkTableCell align="center">{`${
                                    (item.duration_taken_minutes < 10 ? '0' :'') +
                                    item.duration_taken_minutes
                                    }:${
                                        (item.duration_taken_seconds < 10 ? '0' :'') +
                                    item.duration_taken_seconds
                                    }`}</DarkTableCell>
                                {/**
                                 * Switch case para colocar la descripción del estatus
                                 */
                                }
                                <DarkTableCell align="right"> {
                                {
                                    1: "Pendiente",
                                    0: "Finalizada",
                                    2: "En curso",
                                    }[ item.status ]
                                }
                                </DarkTableCell> 
                                <DarkTableCell align="right" style={{fontSize:"15px"}}>
                                    {item.UPDATEDATE}
                                </DarkTableCell>
                                <DarkTableCell align="center">
                                {item.status === 1 && 
                                    CustomButton(<EditIcon />, "", "Editar tarea...", "darkBlue", "white", ()=>clickEditTask(item), loading )
                                }
                                </DarkTableCell>
                                <DarkTableCell align="center">
                                {item.status === 1 && 
                                    CustomButton(<PlayArrowIcon />, "Iniciar", "Iniciar tarea...", (!itemTask?"gold":"lightGray"), "black", ()=>inProccess(item), loading || itemTask!==null )
                                }
                                {item.status === 2 && 
                                CustomButton(<StopIcon />, "Finalizar", "Finalizar tarea...", "red", "yellow", ()=>finishTask(), loading )
                                }
                                </DarkTableCell>
                            </DarkTableRow>
                        ))
                        )}
                        {rows &&
                        rows.length===0 &&
                        (
                            <DarkTableRow key={1}>
                                <DarkTableCell align="center" colSpan={7}>Sin tareas para mostrar</DarkTableCell>
                            </DarkTableRow>
                        )}
                        </TableBody>
                    
                    </Table>
                    {
                        /**
                         * componente para la paginación de la tabla
                         */
                         TablePaginationCustom(rows, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage)   

                    }</TableContainer>
            </Grid>
            <Grid item lg={1} md={1} sm={"auto"} xs={"auto"}></Grid>
            </Grid>
        </div>
    )
}