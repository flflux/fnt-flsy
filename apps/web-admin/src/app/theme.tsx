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
          marginTop:'17px'
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
        },
        // contained: {
        //   backgroundColor: '#4CAF50',
        //   color: 'white',
        //   '&:hover': {
        //     backgroundColor: '#45A049',
        //   },
        // },
      },
    },
      // MuiIconButton: {
      //   styleOverrides:{
      //     root:{
      //       "&:hover": {
      //         backgroundColor: 'rgba(0, 0, 0, 0)',
      //         color: 'rgba(0, 0, 0, 0)',
      //       },
      //     }
      //   }
      // },
    
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
            border: "hidden"
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
          borderRadius: 8
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
       }
      }
    }

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
      color: "black"
    },
    body2: {
      fontSize: '1rem',
      fontFamily: "Poppins",
      color: "black"
    },
    button: {
      fontFamily: "Poppins"
    }

  }

})

export default responsiveFontSizes(theme);