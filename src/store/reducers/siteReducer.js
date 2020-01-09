const initState = {};

const siteReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_SITE_SUCCESS':
      console.log('create site success');
      return state;
    case 'CREATE_SITE_ERROR':
      console.log('create site error');
      return state;
    case 'UPDATE_SITE_SUCCESS':
      console.log('gud');
      return state;
    case 'UPDATE_SITE_ERROR':
      console.log('bad');
      return state;
    case 'TOOL_SITE_SUCCESS':
      console.log('gud');
      return state;
    case 'TOOL_SITE_ERROR':
      console.log('tool site error');
      return state;
    default:
      return state;
  }
};

export default siteReducer;