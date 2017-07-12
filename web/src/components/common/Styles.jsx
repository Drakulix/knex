
const mainColor ="#ff5000";

export default {
  
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  chip: {
    margin: '8px 8px 0 0',
    float: 'left',
    background: mainColor,
    color: '#ffffff',

  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  largeIcon: {
    width: 32,
    height: 32,
    marginLeft: 10,
    marginRight: 10,
    padding: 1,
    color: '#292b2c',
  },
  chipText:{
    background: mainColor,
    fontWeight: 'bold'
  },
  datePicker: {
      selectColor: mainColor
  },
  palette : {
      primary1Color : mainColor,
      accent1Color : "#000000",
      pickerHeaderColor: mainColor,

  }
};
