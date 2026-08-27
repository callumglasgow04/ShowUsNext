import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    palette: {
        mode: 'dark', 

        primary:{
            main: '#044fff'
        },
        secondary:{
            main: '#9c27b0'
        },
        background: {
            default: '#1A1D20',
            paper: '#181818'
        }
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
    },
    shape: {
        borderRadius: 8,
    },
});