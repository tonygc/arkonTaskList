import { SaveButton, CancelButton, GreenButton, DeepOrangeButton, ConfirmationDialog, EditTextBinded, SelectBinded, BackdropLoading,
    MessageError, MessageSuccess, DarkTableRow, DarkTableCell, ManagePagination, TablePaginationCustom } 
    from '../reusables-components'
import { Grid, Box, Typography } from '@material-ui/core'
import { VictoryBar, VictoryChart, VictoryLabel, VictoryAxis } from 'victory';
    
    export const Presentational=(
        {
            dates, 
            onChangeInput,
            backToList,
            response,
            loading,
            error,
            data
        })=>{

    return (
        <div>
            {BackdropLoading(loading)}
            <Grid container spacing={2}>
                <Grid item lg={4} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item lg={4} md={8} sm={10} xs={12}>
                    <Typography variant="h4"  style={{textAlign:"center"}}>
                        Gráfica de productividad
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
                <Grid item lg={1} md={1} sm={"auto"} xs={"auto"}></Grid>
                <Grid item lg={4} md={5} sm={5} xs={12}>
                    {EditTextBinded("date1","Desde", dates.date1, (ev)=>{onChangeInput(ev)}, loading, "date")}
                </Grid>
                <Grid item lg={1} md={1} sm={"auto"} xs={"auto"}></Grid>
                <Grid item lg={4} md={5} sm={5} xs={12}>
                    {EditTextBinded("date2","Hasta", dates.date2, (ev)=>{onChangeInput(ev)}, loading, "date")}
                </Grid>
                <Grid item lg={2} md={"auto"} sm={"auto"} xs={"auto"}></Grid>
                <Grid item lg={2} md={2} sm={1} xs={"auto"}></Grid>
                <Grid item xs={8}>
                    <Box mt={-5}>
                        {data &&
                            data.length>0 &&
                        <VictoryChart
                            domainPadding={20}>
                                    <VictoryAxis
                                            dependentAxis

                                        />
                                    <VictoryAxis
                                    style={{tickLabels:{padding:20, fontSize:10}}}
                                        tickLabelComponent={<VictoryLabel angle={60} />}/>
                            <VictoryBar
                            data={data}
                            labels={({ datum }) => datum.total}
                            style={{ labels: { fill: "white" } }}
                            labelComponent={<VictoryLabel dy={30}/>}
                            x="date"
                            y="total"
                            />
                        </VictoryChart>
                        }
                            {data &&
                                data.length===0 &&
                            <Typography variant="h5" color="secondary" style={{textAlign:"center"}}>
                                No hay información para mostrar
                            </Typography>
                        }
                    </Box>
                </Grid>
                <Grid item lg={2} md={2} sm={1} xs={"auto"}></Grid>
            </Grid>
        </div>
    );
    };