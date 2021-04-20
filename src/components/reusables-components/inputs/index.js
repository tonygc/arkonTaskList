import { Select, InputLabel, TextField, Backdrop, CircularProgress, FormControl, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export const EditTextBinded=(id, label, value, onChangeInput, disabled, type="text", inputProps={})=>{
    /**
     * Sintaxis de Edit Text
     * El evento onChange actualiza el estado que coincida con el nombre del atributo "id"
     */
    return (<TextField
        required
        type={type}
        fullWidth
        id={id}
        label={label}
        variant="outlined"
        value={value} 
        disabled={disabled}
        onChange={(ev)=> onChangeInput(ev)}
    />)

};

export const SelectBinded=(id, title, values, value, handleChange, disabled)=>{
    const classes=useStyles();
    return (
        <FormControl style={{margin:0}} fullWidth variant="outlined" className={classes.formControl}>
        <InputLabel id={id+"-label"}>{title}</InputLabel>
        <Select
          labelId={id+"-label"}
          id={id}
          name={id}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          label={title}
        >
            {values.map((item)=>(
                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
            ))}
        </Select>
      </FormControl>
    )
}