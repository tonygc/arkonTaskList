import { Backdrop, CircularProgress } from '@material-ui/core'
export const BackdropLoading=(loading)=>{
    /** Elemento para mostrar un loader
     *  Se muestra si el parametro "loading" es igual a true
     */
    return (
        <Backdrop style={{zIndex:1000, color:"#000"}} open={loading}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}