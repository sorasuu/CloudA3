
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
    },
    dialogTitle:{
        fontSize: 30,
        fontFamily:'Montserrat, sans-serif',
        padding:20
    },
}));


function FormError(props) {
    if (props.isHidden) {
        return null;
    }
    return <div className="form-warning">{props.errorMessage}</div>;
}
const validateInput = checkingText => {
    const regexp = /^[a-zA-Z]+$/;
    const checkingResult = regexp.exec(checkingText);
    if (checkingResult !== null) {
        return { isInputValid: true, errorMessage: "" };
    } else {
        return { isInputValid: false, errorMessage: "Error " };
    }
};

export default function ToolRequest() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [shirt, setShirt] = React.useState(0);
    const [tong, setTong] = React.useState(0);
    const [gloves, setGloves] = React.useState(0);
    const [bag, setBag] = React.useState(0);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeShirt = e => {
       setShirt(e.target.value)
    };
    const handleChangeTong = e => {
        setTong(e.target.value)
    };
    const handleChangeGloves = e => {
        setGloves(e.target.value)
    };
    const handleChangeBag = e => {
        setBag(e.target.value)
    };

    const handleSubmit = e => {
        e.preventDefault();

        setOpen(false);
        console.log(props);
        const ToolRequest = {
            id:props.props.match.params.id,
        "siteName": props.props.site.title,
           "shirt": shirt,"tong": tong,"gloves": gloves,"bag": bag
        };

        console.log(ToolRequest)
        // props.props.sendTool(ToolRequest)
        // this.props.createVolunteer(volunteer);

    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
               Send Tools Request
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" style={{minWidth:300}}>
                <Typography className={classes.dialogTitle} id="form-dialog-title">Tool Request</Typography>
                <DialogContent>
                    <form className="white" onSubmit={handleSubmit}>
                        <div>Shirt</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="shirt"
                                onChange={handleChangeShirt}
                                value={shirt}
                                required
                            />
                        </div>

                        <div>Tong</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="tong"
                                onChange={handleChangeTong}
                                value={tong}
                                required
                            />
                        </div>

                        <div>Gloves</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="gloves"
                                onChange={handleChangeGloves}
                                value={gloves}
                                required
                            />
                        </div>

                        <div>Bags</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="bag"
                                onChange={handleChangeBag}
                                value={bag}
                                required
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit Request
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}