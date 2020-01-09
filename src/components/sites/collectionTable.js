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

function createRow(desc, items, qty, weight) {
  return { desc, items, qty, weight };
}

function subtotal(items) {
  const totalQty = items.map(({ qty }) => qty).reduce((sum, i) => sum + i, 0);
  const totalWeight = items
    .map(({ weight }) => weight)
    .reduce((sum, i) => sum + i, 0);
  return { totalQty, totalWeight };
}

const rows = [
  createRow(
    "Organic",
    ["Food", "Food Soiled Paper", "Non-Hazardous Wood Waste", "Green Waste"],
    100,
    115
  ),
  createRow(
    "Recyclable",
    ["Paper", "Glass", "Metals", "Food Scraps"],
    [10,20,30,40],
    [15,25,35,45]
  ),
  createRow(
    "Non-Recyclable",
    ["Plastics", "Metals", "Steels", "Batteries"],
    2,
    179.9
  )
];

const total = subtotal(rows);
function CollectionTable(props) {
  // console.log(props, "prop trong ColTab");
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Desc</StyledTableCell>
            <StyledTableCell align="right">Qty.</StyledTableCell>
            <StyledTableCell align="right">Weight</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow style={{ background: "lightgreen" }}>
            <TableCell align={"left"}>Total</TableCell>
            <TableCell align="right">{total.totalQty}</TableCell>
            {/*<TableCell align="right">{ccyFormat(total.totalWeight)}</TableCell>*/}
          </TableRow>
          {rows.map(row => (
            <TableRow key={row.desc}>
              <TableCell>{row.desc}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              {/*<TableCell align="right">{ccyFormat(row.weight)}</TableCell>*/}
            </TableRow>
          ))}

          <TableRow style={{ background: "lightgreen" }}>
            <TableCell align={"center"}>Number of Participants</TableCell>
            <TableCell align="right" colSpan={3}>
              1SoGiDo
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default CollectionTable;
