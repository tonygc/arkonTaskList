import { SaveButton, CancelButton, GreenButton, DeepOrangeButton, ConfirmationDialog, EditTextBinded, SelectBinded, BackdropLoading,
    MessageError, MessageSuccess, DarkTableRow, DarkTableCell, ManagePagination, TablePaginationCustom } 
    from '../reusables-components'
import { Grid, Box, Typography } from '@material-ui/core'
    
    export const Presentational=(
        {
            dataTask, 
            setDataTask,
            onChangeInput,
            submitForm,
            backToList,
            response,
            loading,
            error
        })=>{
    return (
        <div>
            {BackdropLoading(loading)}
            <Grid container spacing={2}>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    <Typography variant="h4">
                        Mantenimiento de Tareas
                    </Typography>
                </Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                {error &&
                    /**
                     * Mostrar mensaje de error si la propiedad "error" es diferente a vacío
                     */
                MessageError(error, error)}
                {response &&
                    (response.success===false &&
                    /**
                     * Mostrar mensaje de error si la propiedad "response.error" es diferente a vacío
                     */
                    MessageError(response.error,!response.success))
                }
                {
                response &&
                    (response.success===true &&
                    /**
                     * Mostrar mensaje de éxito si la propiedad "response.success" es igual a true
                     */
                    MessageSuccess("", response.success))
                }
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    {
                    EditTextBinded("description","Descripción", dataTask.description, (ev)=> onChangeInput(ev), loading)}
                </Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    <Typography  variant="h6">Duración</Typography>
                </Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    {SelectBinded("status_duration", "Clasificación",[{id:1,name:"Corta"},{id:2,name:"Media"},{id:3,name:"Larga"}] , dataTask.status_duration, (ev)=> onChangeInput(ev), loading)}
                </Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    {EditTextBinded("duration_minutes","Minutos", dataTask.duration_minutes, (ev)=> onChangeInput(ev), loading, "number",{inputProps:{min:"0",max:"120",step:"1"}})}
                </Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    {EditTextBinded("duration_seconds","Segundos", dataTask.duration_seconds, (ev)=> onChangeInput(ev), loading, "number", {inputProps:{min:"0",max:"59",step:"1"}})}
                </Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    <Grid container>
                        <Grid item xs={6}>
                            {SaveButton("Guardar", submitForm, loading)}
                        </Grid>
                        <Grid item xs={6}>
                            <Box display="flex" justifyContent="flex-end">
                                {CancelButton("Cancelar", backToList, loading)}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
    };