import { Grid, Box, InputLabel } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error';
import DoneIcon from '@material-ui/icons/Done';

export const gridMessageError=(message, show)=>{
    /**
     * Elemento para mostrar mensaje de error
     * Se muestra si el parametro show es igual a true
     */
    return (
        show && 
        <Grid container>
            <Grid item lg={3} md={2} sm={1} xs={"auto"}></Grid>
            <Grid item lg={6} md={8} sm={10} xs={12}>
                <Box display="flex" justifyContent="center">
                    <InputLabel error style={{fontWeigth:"bolder",fontSize:"20px"}}><ErrorIcon /> Error al procesar la solicitud. {message}</InputLabel>
                </Box>
            </Grid>
            <Grid item lg={3} md={2} sm={1} xs={"auto"}></Grid>
        </Grid>
        
    )
}
export const gridMessageSuccess=(message, show)=>{
    /**
     * Elemento para mostrar mensaje de éxito
     * Se muestra si el parametro show es igual a true
     */
    return (
        show &&
        <Grid container>
            <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
            <Grid item lg={4} md={8} sm={10} xs={12}>
                <Box display="flex" justifyContent="center">
                    <InputLabel style={{color:"green",fontWeigth:"bolder",fontSize:"20px"}} ><DoneIcon /> Solicitud procesada con éxito. {message}</InputLabel>
                </Box>
            </Grid>
            <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
        </Grid>
    )
}