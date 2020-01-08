
import React, { useState } from "react";
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
  button:{
    display: 'block',
    marginTop: theme.spacing(2),
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function FormError(props) {
  if (props.isHidden) {
    return null;
  }
  return <div className="form-warning">{props.errorMessage}</div>;
}

function VolunteerForm(props) {
  console.log(props, "props volunteerForm");
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isBuyShirt, setBuyShirt] = useState(false);
  const [buyTools, setBuyTools] = useState([]);
  const tools = ["bags", "tong", "gloves"];
  const [size, setSize] = useState();
  const sizes = ['XS','S','M', 'L', 'XL'];
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phoneNumber, setPhone] = useState(null);
  const [dob, setDate] = useState(new Date());
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleBuyShirt = () => {
    setBuyShirt(!isBuyShirt);
  };
  const handleSize = event => {
    setSize(event.target.value)
  };

  const handleBuyTool = event => {
    setBuyTools(event.target.value);
  };

  const handleChangeName = e => {
    setName(e.target.value);
  };
  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };
  const handleChangePhone = e => {
    setPhone(e.target.value);
  };
  const handleChangeDOB = date => {
    setDate(date);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(this.state);
    const volunteer = {
      id: (email + name)
        .split("@")
        .join("")
        .split(".")
        .join("")
        .split(" ")
        .join(""),
      name: name,
      email: email,
      phoneNumber: phoneNumber,
      dob: dob,
      siteId: props.props.match.params.id
      // siteId: props.props.id
    };
    props.props.createVolunteer(volunteer);
    props.props.history.push("/");
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Đăng Kí Tham Gia
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <form className="white" onSubmit={handleSubmit}>
            <h5
              className="grey-text text-darken-3"
              style={{ textAlign: "center" }}
            >
              Đăng Ký Sự Kiện
            </h5>
            <div className="input-field">
              <input
                type="text"
                id="name"
                onChange={handleChangeName}
                required
              />
              <label htmlFor="name">Tên</label>
              <FormError type="title" />
            </div>
            <div className="input-field">
              <textarea
                id="email"
                className="materialize-textarea"
                onChange={handleChangeEmail}
                required
              ></textarea>
              <label htmlFor="email">Email</label>
            </div>
            <div className="input-field">
              <textarea
                id="phoneNumber"
                className="materialize-textarea"
                onChange={handleChangePhone}
                defaultValue={null}
              ></textarea>
              <label htmlFor="phoneNumber">Số Điện Thoại</label>
              <FormError
                type="title"
                // isHidden={this.state.isInputValid}
                // errorMessage={this.state.errorMessage}
              />
            </div>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <label htmlFor="phoneNumber">Ngày Sinh </label>
                <DatePicker
                  selected={dob}
                  onChange={handleChangeDOB}
                  dateFormat="dd-MM-yyyy"
                />
              </Grid>
              <Grid item xs={9}>
                <div className={'card'} style={{paddingLeft:5}}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <i>Bạn có muốn mua: </i>
                  </Grid>
                  <Grid item xs={8}>
                    <Checkbox
                      checked={isBuyShirt}
                      onClick={() => handleBuyShirt()}
                    />
                    Áo Sự Kiện
                    {isBuyShirt &&  <FormControl className={classes.formControl}>
                      <InputLabel id="demo-controlled-open-select-label">Cỡ Áo:</InputLabel>
                      <Select
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          value={size}
                          onChange={handleSize}
                      >
                        {sizes.map(name => (
                            <MenuItem key={name} value={name}>
                              {name}
                            </MenuItem>
                        ))}
                      </Select>
                    </FormControl>}

                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-mutiple-chip-label">
                        Chọn đồ
                      </InputLabel>
                      <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={buyTools}
                        onChange={handleBuyTool}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={selected => (
                          <div className={classes.chips}>
                            {selected.map(value => (
                              <Chip
                                key={value}
                                label={value}
                                className={classes.chip}
                              />
                            ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {tools.map(name => (
                          <MenuItem key={name} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                </div>
              </Grid>
            </Grid>

            <div className="input-field">
              <button className="btn lighten-1" color="#39B04B">
                Đăng ký
              </button>
              <Button
                onClick={handleClose}
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

export default VolunteerForm;

