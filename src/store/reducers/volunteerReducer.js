const initState = {}

const volunteerReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_VOLUNTEER_SUCCESS':
      console.log('create volunteer success');
      return state;
    case 'CREATE_VOLUNTEER_ERROR':
      console.log('create volunteer error');
      return state;
    case 'CREATE_EMAIL_SUCCESS':
      console.log('create email success');
      return state;
    case 'CREATE_EMAIL_ERROR':
      console.log('create email error');
      return state;
    default:
      return state;
  }
};

export default volunteerReducer;