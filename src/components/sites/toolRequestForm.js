
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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

    const handleChangeShirt = e => {
       setShirt(e)
    };
    const handleChangeTong = e => {
        setTong(e)
    };
    const handleChangeGloves = e => {
        setGloves(e)
    };
    const handleChangeBag = e => {
        setBag(e)
    };

    const handleSubmit = e => {
        e.preventDefault();
        // console.log(this.state);
        const ToolRequest = {
            shirt, tong, gloves, bag
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
                                onChange={handleChangeShirt}
                                required
                            />
                        </div>

                        <div>Tong</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="tong"
                                onChange={handleChangeTong}
                                required
                            />
                        </div>

                        <div>Gloves</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="gloves"
                                onChange={handleChangeGloves}
                                required
                            />
                        </div>

                        <div>Bags</div>
                        <div className="input-field">
                            <input
                                type="numeric"
                                id="bag"
                                onChange={handleChangeBag}
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