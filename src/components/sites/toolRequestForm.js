import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

    const handleChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = e => {
        e.preventDefault();
        // console.log(this.state);
        const ToolRequest = {

        };
        // this.props.createVolunteer(volunteer);
        this.props.history.push("/");
    };
    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
               Send Tools Request
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" style={{minWidth:300}}>
                <DialogTitle id="form-dialog-title">Tool Request</DialogTitle>
                <DialogContent>
                    <form className="white" onSubmit={handleSubmit}>
                        <div>Shirt</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="shirt"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>Tong</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="tong"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>Gloves</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="gloves"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>Bags</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="bag"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Subscribe
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}