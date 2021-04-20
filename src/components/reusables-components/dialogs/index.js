import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'

export function ConfirmationDialog(props) {
    const { title, message, onClose, open, ...other } = props;
   
    const handleCancel = () => {
      onClose(false);
    };
  
    const handleOk = () => {
      onClose(true);
    };
  
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
        <DialogContent dividers>
          {message}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  