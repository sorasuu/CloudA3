import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DatePicker from "react-datepicker";
import {
  Checkbox,
  Input,
  makeStyles,
  useTheme,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Chip,
  Grid
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 4
  },
  noLabel: {
    marginTop: theme.spacing(2)
  },
  button: {
    display: "block",
    marginTop: theme.spacing(2)
  }
}));

function FormError(props) {
  if (props.isHidden) {
    return null;
  }
  return <div className="form-warning">{props.errorMessage}</div>;
}

export default class CollectionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      organic: 0,
      organicPiece: 0,
      recycle: 0,
      recyclePiece: 0,
      nonRecycle: 0,
      nonRecyclePiece: 0,
      participants: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmitCollection = this.handleSubmitCollection.bind(this);
    console.log(this.props, "collectionForm")
  }
  handleChange(e) {
    this.setState({ [e.target.id]: parseInt(e.target.value) });
  }
  handleClickOpen() {
    this.setState({ isOpen: true });
  }
  handleClose() {
    this.setState({ isOpen: false });
  }
  handleSubmitCollection(event) {
    event.preventDefault();
    const summary = {
        organic: this.state.organic,
        organicPiece: this.state.organicPiece,
        recycle: this.state.recycle,
        recyclePiece: this.state.recyclePiece,
        nonRecycle:this.state.nonRecycle,
        nonRecyclePiece: this.state.nonRecyclePiece,
        participants: this.state.participants
    };
    this.props.id.editSite({id: this.props.id.match.params.id, ...this.props.site, summary: summary})
    this.handleClose()
  }
  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Tổng Kết Sự Kiện
        </Button>
        <Dialog
          open={this.state.isOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <form className="white" onSubmit={this.handleSubmitCollection}>
              <h4
                className="grey-text text-darken-3"
                style={{ textAlign: "center" }}
              >
                Tổng Kết Sự Kiện
              </h4>
              <div className={"container"}>
                <h6>Organic Trash</h6>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div>
                      <label>
                        Pieces(#)
                        <input
                          type="numeric"
                          id="organicPiece"
                          onChange={this.handleChange}
                          value={this.state.organicPiece}
                          defaultValue={0}
                        />
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <label>
                        Weight(kg)
                        <input
                          type="numeric"
                          id="organic"
                          onChange={this.handleChange}
                          value={this.state.organic}
                          defaultValue={0}
                        />
                      </label>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className={"container"}>
                <h6>Recyclable</h6>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div>
                      <label>
                        Pieces(#)
                        <input
                          type="numeric"
                          id="recyclePiece"
                          onChange={this.handleChange}
                          value={this.state.recyclePiece}
                          defaultValue={0}
                        />
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <label>
                        Weight(kg)
                        <input
                          type="numeric"
                          id="recycle"
                          onChange={this.handleChange}
                          value={this.state.recycle}
                          defaultValue={0}
                        />
                      </label>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className={"container"}>
                <h6>Non-Recyclable</h6>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <div>
                      <label>
                        Pieces(#)
                        <input
                          type="numeric"
                          id="nonRecyclePiece"
                          onChange={this.handleChange}
                          value={this.state.nonRecyclePiece}
                          defaultValue={0}
                        />
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <label>
                        Weight(kg)
                        <input
                          type="numeric"
                          id="nonRecycle"
                          onChange={this.handleChange}
                          value={this.state.nonRecycle}
                          defaultValue={0}
                        />
                      </label>
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className={"container"}>
                <h6>Number of participants</h6>
                  <label>Participants:
                <input
                  type="numeric"
                  id="participants"
                  onChange={this.handleChange}
                  value={this.state.participants}
                  defaultValue={0}
                />
                  </label>

              </div>
              <div className="input-field">
                <button className="btn lighten-1" color="#39B04B">
                  Hoàn Thành
                </button>
                <Button
                  onClick={this.handleClose}
                  className="btn lighten-1"
                  color="#39B04B"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
