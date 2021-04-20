import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel';
import { green, deepOrange } from '@material-ui/core/colors';

const GreenButtonStyle = withStyles((theme) => ({
    root: {
    color:"white",
      //color: theme.palette.getContrastText(green[500]),
      backgroundColor: green[700],
      '&:hover': {
        backgroundColor: green[900],
      },
    },
  }))(Button);

  const DeeporangeButtonStyle = withStyles((theme) => ({
    root: {
    color:"white",
      //color: theme.palette.getContrastText(green[500]),
      backgroundColor: deepOrange[700],
      '&:hover': {
        backgroundColor: deepOrange[900],
      },
    },
  }))(Button);

export const SaveButton = (text, clickEvent, disabled) => {
  /**
   * Botón predeterminado "Guardar"
   * El clickEvent es la acción que realiza el botón, debe estár en el componente que manda 
   * llamar éste método
   */
    return(
        <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={clickEvent}
        title={text}
        disabled={disabled}
        startIcon={<SaveIcon />}
        >
        {text}
        </Button>
    )
};
export const CancelButton = (text, clickEvent, disabled) => {
  /**
   * Botón predeterminado "Cancelar"
   * El clickEvent es la acción que realiza el botón, debe estár en el componente que manda 
   * llamar éste método
   */
    return(
        <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={clickEvent}
        disabled={disabled}
        title={text}
        startIcon={<CancelIcon />}
        >
        {text}
        </Button>
    )
};
export const GreenButton = (text, tooltip ,clickEvent, icon, disabled, fullWidth=true) => {
  /**
   * Component para crear un botón verde
   * el parámetro "icon" recibe un ícono de material ui y lo coloca al inicio del botón.
   */
    return(
        <GreenButtonStyle
        fullWidth={fullWidth}
        variant="contained"
        size="large"
        text={text}
        title={tooltip}
        onClick={clickEvent}
        disabled={disabled}
        startIcon={icon}>
            {text}
        </GreenButtonStyle>
    )
};
export const DeepOrangeButton = (text, tooltip ,clickEvent, icon, disabled, fullWidth=true) => {
    /**
     * componente boton color naranja.
     * el parámetro "icon" recibe un ícono de material ui y lo coloca al inicio del botón.
     */
    return(
        <DeeporangeButtonStyle
        fullWidth={fullWidth}
        variant="contained"
        size="large"
        text={text}
        title={tooltip}
        onClick={clickEvent}
        disabled={disabled}
        startIcon={icon}>
            {text}
        </DeeporangeButtonStyle>
    )
};

/**
 * 
 * @param {*} icon: Ícono Material UI que va colocarse al centro del botón
 * @param {*} text: Texto que va colocarse al centro del botón 
 * @param {*} tooltip: Título del botón que aparecerá al colocar el mouse en hover
 * @param {*} backGroundColor: Color de Fondo del botón
 * @param {*} textColor: Color de Texto del botón 
 * @param {*} clickEvent: Evento click
 * @param {*} disabled: Deshabilitado
 * @param {*} size: Tamaño del botón
 * @param {*} fullWidth: Tomar Anchura completa 
 * @returns 
 */
export const CustomButton=(icon, text, tooltip, backGroundColor, textColor, clickEvent, disabled, size="large", fullWidth=true)=>{
  return(
    <Button style={{backgroundColor:backGroundColor, color:textColor}} 
            title={tooltip}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled} 
            onClick={clickEvent}>{icon}{text}</Button>
  )
}