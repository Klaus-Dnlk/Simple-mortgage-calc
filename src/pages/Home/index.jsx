import { 
    Grid, 
    Container, 
    Typography 
} from "@mui/material";


function Home() {
    
    return (
        <Container maxWidth="sm" 
            sx={{ p: 3 }}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2" gutterBottom>
                        Mortgage Calculator
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                    This application is created for the service of mortgage calculating.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Home