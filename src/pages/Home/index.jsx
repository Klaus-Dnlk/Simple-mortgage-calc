import { 
    Grid, 
    Container, 
    Typography 
} from "@mui/material";

import CalculatorIframe from "../../components/IframeComponent";


function Home() {
    
    return (
        <Container maxWidth="sm" 
            sx={{ p: 3 }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h3" sx={{textAlign: 'center'}}>Welcome to</Typography>
                    <Typography variant="h4" gutterBottom sx={{textAlign: 'center'}}>
                        Financial service of calculating the mortgage
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{textAlign: 'center'}}>
                    This application is created for home usage only.
                    </Typography>
                </Grid>
            </Grid>
        <CalculatorIframe />
        </Container>
    )
}

export default Home