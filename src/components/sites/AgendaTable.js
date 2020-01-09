import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardTimePicker } from "@material-ui/pickers";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
    width:100
  }

}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const useStyles = makeStyles({
  table: {
    maxWidth: 700,
    minWidth:300,
  }
});

export default function AgendaTable(props) {
  console.log(props, "agenda props");
  const classes = useStyles();
  const rows =props.props.site.agendas;
  const [open, setOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [activity, setActivity] = React.useState();
  const handleChangeActivity = e => {
    setActivity(e.target.value);
  };
  const handleDateChange = e => {
    setSelectedDate(e.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const timeOptions={
    hour12: false,
    hour:  "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
      var agendas = null;
        if (rows!== undefined) {
              agendas = [      ...rows,
                {"activity":activity ,"selectedDate": selectedDate}]
        
        }
        else{
              agendas = [{"activity":activity ,"selectedDate": selectedDate}]
 
        }
       

        props.props.editSite({...props.props.site,
            "agendas":agendas,"id":props.props.match.params.id});
    
    setOpen(false);
  };
  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{maxWidth:50}}>Date</StyledTableCell>
              <StyledTableCell align="center">Activity</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableCell align={'right'}>{(props.props.site.date.toDate()).toLocaleString('en-GB')}</StyledTableCell>
            <StyledTableCell align="left">Event Begin</StyledTableCell>

            {rows?rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align={'right'} component="th" scope="row">
                  {(row.selectedDate.toDate()).toLocaleTimeString("en-GB", timeOptions)}
                </StyledTableCell>
                <StyledTableCell align="left">{row.activity}</StyledTableCell>
              </StyledTableRow>
            )):<p>loading...</p>}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{textAlign:"center"}}>
      <Button variant={"outlined"} color={"primary"} onClick={handleClickOpen}>
        Add Activity
      </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Activity</DialogTitle>
        <DialogContent style={{ minWidth: 500, minHeight: 400 }}>
          <form>
            <div className={"input-field"}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Select time for activity"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
              />
                </MuiPickersUtilsProvider>
              <p>Activity Content</p>

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
