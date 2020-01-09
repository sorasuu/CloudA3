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
    createData('21/12/2019', 'Event Begin'),
    activities,

];

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

class AgendaTable extends React.Component {
    constructor(props){
        super(props)
        this.state={
            open:false,
            date: new Date(),
            activity:""
        };
    }
    handleChange = (e) => {
        this.setState({
          [e.target.id]: e.target.value
        })
      };
    handleClickOpen = () => {
        this.setState({open:true});
    };

    handleClose = () => {
        this.setState({open:false});
    };
    handleSubmit = () => {
        this.setState({open:false});
    };
    render(){
        const {agenda}= this.props
        return (
            <div>
            <TableContainer component={Paper}>
                <Table  aria-label="customized table">
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
            <Button variant={"outlined"} color={"primary"} onClick={this.handleClickOpen}>Add Activity</Button>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>
                    <DialogContent style={{minWidth:500, minHeight:400}}>
                        <form>
                            <div className={"input-field"}>
    
                                    <div>
                                        Selection Time (h:mm aa):
                                    </div>
                                        <DatePicker
                                            selected={this.date}
                                            onChange={this.handleChangeDate}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeFormat="HH:mm"
                                            timeInterval={15}
                                            timeCaption = "time"
                                            dateFormat="h:mm a a"
                                        />
    
                                        <p>Activity</p>
    
                                        <textarea
                                            selected={this.activity}
                                            id="content"
                                            className="materialize-textarea"
                                            onChange={this.handleChangeActivity}
                                            required
                                        />
    
    
                            </div>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
export default  AgendaTable;
