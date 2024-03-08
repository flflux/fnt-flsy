import { responsiveFontSizes } from "@mui/material";
import { blue, purple, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";


const theme = createTheme({
  palette: {
    primary: {
      main: '#D23F57'
    },
    secondary: {
      main: '#fffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#D23F57',
          width: '127px',
          height: '44px',
          marginTop:'17px',
          color:'white',
          '&:hover': {
            backgroundColor: '#D23F57',
            color:'white'
          },
        },
        containedPrimary: {
          backgroundColor: '#D23F57',
          '&:hover': {
            backgroundColor: '#D23F57',
          },
        },
        containedSecondary: {
          backgroundColor: 'white',
          color:'black',
          '&:hover': {
            backgroundColor: 'white',
            color:'black',
          },
        },
       containedInfo:{
        backgroundColor:'#01579b!important', 
        marginInline:'-3px',
        marginRight:'16px',
        fontWeight: '400',
        fontSize: '0.725rem',
        width:'100px'
        // '&:hover':{
        //   backgroundColor:'rgba(2, 136, 209, 0.04)',
        //   color:'black',
        // }
       }
      },
    },
    MuiTablePagination: {
      styleOverrides: { 
        root: {
        },
        displayedRows: {
          fontSize: '1rem',
          fontFamily: 'Poppins',
          color: 'black',
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          flexShrink: 0,
          marginTop: '30px',
        },
        selectLabel: {
          fontSize: '1rem',
          fontFamily: 'Poppins',
          color: 'black',
          fontWeight: 400,
          lineHeight: 1.43,
          letterSpacing: '0.01071em',
          flexShrink: 0,
          marginTop: '28px',
        },
      },
    },
    
    // MuiOutlinedInput:{
    //     styleOverrides:{
    //         root:{
    //             "&:focused": {
    //                 borderColor:'black'
    //               },
    //             },
    //     },

    // },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            color: "BLACK",
            backgroundColor: "#cacaca",
            fontSize: "20px",
            border: "hidden",
            // position:"sticky",
            // top: 0,
          },
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "16px"
        }
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
          // maxHeight: 460,
          // '&::-webkit-scrollbar': {
          //   display: 'none',
          // },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // backgroundColor:"#D3D3D3",
          backgroundColor: "white",
          variant: "standard"

        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          // backgroundColor:"#D3D3D3",
          // backgroundColor:"white",
          // variant:"standard"
          justifyContent: 'center'

        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          "&:focused": {
            borderColor: 'black'
          },
        },
      },
    },

    MuiBreadcrumbs:{
      styleOverrides: {
       root:{
        marginTop:'15px',
        marginLeft:'25px'
       },
      },
    },
  },
  overrides: {
    MuiPickersToolbarText: {
      root: {
        // Your styles here
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'blue',
        // Add more styles as needed
      },
    },
  },
  
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 400,
      fontFamily: "Poppins",
      color: "black"
    },
    body1: {
      fontSize: '1.2rem',
      fontFamily: "Poppins",
      // color: "white"
    },
    body2: {
      fontSize: '1rem',
      fontFamily: "Poppins",
      color: "black"
    },
    button: {
      fontFamily: "Poppins"
    },
    subtitle1: {
      color: 'white !important',
    },
   

  }

})

export default responsiveFontSizes(theme);