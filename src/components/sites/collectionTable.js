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
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const useStyles = makeStyles({
  table: {
    minWidth: 700
  }
});

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function weightRow(qty, unit) {
  return qty * unit;
}

function createRow(desc, qty, unit) {
  const weight = weightRow(qty, unit);
  return { desc, qty, unit, weight };
}

function subtotal(items) {
  const totalWeight = items
    .map(({ weight }) => weight)
    .reduce((sum, i) => sum + i, 0);
  const totalQty = items.map(({ qty }) => qty).reduce((sum, i) => sum + i, 0);
  const totalUnit = items
    .map(({ unit }) => unit)
    .reduce((sum, i) => sum + i, 0);
  return { totalQty, totalUnit, totalWeight };
}

const rows = [
  createRow("Organic", 100, 1.15),
  createRow("Recyclable", 10, 45.99),
  createRow("Non-Recyclable", 2, 17.99)
];

const total = subtotal(rows);
function CollectionTable(props) {
  console.log(props, "prop trong ColTab");
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Desc</StyledTableCell>
            <StyledTableCell align="right">Qty.</StyledTableCell>
            <StyledTableCell align="right">Unit</StyledTableCell>
            <StyledTableCell align="right">Weight</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">{row.unit}</TableCell>
              <TableCell align="right">{ccyFormat(row.weight)}</TableCell>
            </TableRow>
          ))}

          <TableRow style={{ background: "lightgreen" }}>
            <TableCell align={"center"}>Total</TableCell>
            <TableCell align="right">{total.totalQty}</TableCell>
            <TableCell align="right">{total.totalUnit}</TableCell>
            <TableCell align="right">{ccyFormat(total.totalWeight)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default CollectionTable;
