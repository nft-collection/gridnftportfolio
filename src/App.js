import {useEffect, useState} from 'react';
import {experimentalStyled as styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Link,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import axios from "axios";
import './App.css'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const NFT = styled(Paper)(() => ({
    textAlign: 'center',
    height: '375px', width: '375px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
}));

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Gallery/>
        </QueryClientProvider>
    );
}

function Gallery() {
    const [open, setOpen] = useState(false);
    const [currentNFT, setCurrentNFT] = useState([]);
    const [currentNFTIdx, setCurrentNFTIdx] = useState(0);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const {isLoading, error, data, isFetching} = useQuery("NFTRepo", () =>
        axios.get(
            "https://api.opensea.io/api/v1/assets?format=json"
        ).then((res) => res.data)
    );

    useEffect(() => {
        if (currentNFTIdx >= 0) {
            setCurrentNFT(data?.assets[currentNFTIdx]);
        } else {
            setCurrentNFTIdx(0);
        }
    }, [currentNFTIdx, data?.assets]);

    if (isLoading) {
        return (
            <LinearProgress/>
        );
    }
    if (isFetching) {
        return (
            <LinearProgress/>
        );
    }

    if (error) {
        return "An error has occurred: " + error.message;
    }
    // console.log(currentNFT)
    return (
        <Box sx={{flexGrow: 1}}>
            <br/>
            <Typography variant="h2" component="div" gutterBottom align={'center'}>
                <strong>NFT Gallery</strong>
            </Typography>
            <Grid container spacing={{xs: 1, md: 1}} columns={{xs: 2, sm: 4, md: 10}} justifyContent={'center'}>
                {data.assets?.map((_, index) => (
                    <Grid item key={index}>
                        <NFT elevation={0} direction="column">
                            <div id="zoom_img">
                                <div className="ml-4 imgList" onClick={handleOpen}>
                                    <Link onClick={() => setCurrentNFT(data?.assets[index])}>
                                        <img
                                            onClick={() => setCurrentNFTIdx(index)}
                                            src={data?.assets[index].image_url} alt={data?.assets[index]?.name}/>
                                    </Link>
                                    <div className="imgText justify-content-center m-auto">
                                        <h2>{data?.assets[index]?.name}</h2>
                                    </div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg">
                                    <filter id="blur1">
                                        <feGaussianBlur stdDeviation="3"/>
                                    </filter>
                                </svg>
                            </div>
                        </NFT>
                    </Grid>
                ))}
            </Grid>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="nft_title"
                aria-describedby="nft_description"
                fullWidth={true}
                maxWidth={'lg'}
                fullScreen={fullScreen}
            >
                <DialogTitle id="nft_dialog_title">
                    {currentNFT?.name}
                </DialogTitle>
                <DialogContent>
                    <Typography component="div" gutterBottom align={'center'}>
                        <img src={currentNFT?.image_url} alt={currentNFT?.name}/>
                        <br/>
                        <br/>
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            <Grid item xs={6}>
                                <IconButton aria-label="previous" onClick={() => setCurrentNFTIdx(currentNFTIdx - 1)}>
                                    <ArrowBackIosNewIcon/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={6}>
                                <IconButton aria-label="previous" onClick={() => setCurrentNFTIdx(currentNFTIdx + 1)}>
                                    <ArrowForwardIosIcon/>
                                </IconButton>
                            </Grid>
                        </Grid>

                    </Typography>
                </DialogContent>
            </Dialog>
            <ReactQueryDevtools initialIsOpen/>
        </Box>
    );
}
