import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);
const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

// function ccyFormat(num) {
//   return `${num.toFixed(2)}`;
// }

function subtotal(items) {
  const totalQty = items.map(({ qty }) => qty).reduce((sum, i) => sum + i, 0);
  const totalWeight = items
    .map(({ weight }) => weight)
    .reduce((sum, i) => sum + i, 0);
  return { totalQty, totalWeight };
}

function CollectionTable(props) {
  console.log(props, "prop trong ColTab");
  const summary = props.props.site.summary;
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Waste Types</StyledTableCell>
            <StyledTableCell align="right">Qty.(unit)</StyledTableCell>
            <StyledTableCell align="right">Weight(kg)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align={"left"}>Organic</TableCell>
            <TableCell align="right">{summary.organicPiece}</TableCell>
            <TableCell align="right">{summary.organic}</TableCell>

          </TableRow>
          <TableRow>
            <TableCell align={"left"}>Recyclable</TableCell>
            <TableCell align="right">{summary.recyclePiece}</TableCell>
            <TableCell align="right">{summary.recycle}</TableCell>

          </TableRow>
          <TableRow>
            <TableCell align={"left"}>Non-Recyclable</TableCell>
            <TableCell align="right">{summary.nonRecyclePiece}</TableCell>
            <TableCell align="right">{summary.nonRecycle}</TableCell>

          </TableRow>
          <TableRow style={{ background: "lightgreen" }}>
            <TableCell align={"left"}>Total</TableCell>
            <TableCell align="right">{summary.organicPiece + summary.recyclePiece + summary.nonRecyclePiece}</TableCell>
            <TableCell align="right">{summary.organic + summary.recycle + summary.nonRecycle}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell align={"center"}>Number of Participants</TableCell>
            <TableCell align="right" colSpan={3}>
              {summary.participants}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default CollectionTable;
