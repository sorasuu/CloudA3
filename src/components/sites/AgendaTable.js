import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DatePicker from "react-datepicker";
const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

function createData(date, activity) {
    return { date, activity };
}
const activities = [];
function add(date, activity){
    activities.push(date,activity)
}

const rows = [
    createData('21/12/2019', 'start Date'),
    activities,
    createData('26/12/2019', 'end Date'),
];

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function AgendaTable() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [activity, setActivity] = React.useState();
    const handleChangeActivity = (e) => {
        setActivity(e)
    };
    const handleChangeDate = e => {
        setDate(e)
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {

    };
    return (
        <div>
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell align="center">Activity</StyledTableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {row.date}
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.activity}</StyledTableCell>

                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Button variant={"outlined"} color={"primary"} onClick={handleClickOpen}>Add Activity</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>
                <DialogContent style={{minWidth:500, minHeight:400}}>
                    <form>
                        <div className={"input-field"}>

                                <div>
                                    Date & Time (d MM, yyyy h:mm aa):
                                </div>
                                    <DatePicker
                                        selected={date}
                                        onChange={handleChangeDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeInterval={15}
                                        timeCaption = "time"
                                        dateFormat="d MM, yyyy h:mm aa"
                                    />

                                    <p>Activity</p>

                                    <textarea
                                        selected={activity}
                                        id="content"
                                        className="materialize-textarea"
                                        onChange={handleChangeActivity}
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
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
