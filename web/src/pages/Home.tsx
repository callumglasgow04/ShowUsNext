import { Box, Typography } from "@mui/material";
import ShowCard from "../components/ShowCard/ShowCard";
import ShowCarousel from "../components/ShowCarousel/ShowCarousel";

const shows = [
    {
        id: 1,
        title: 'Breaking Bad',
    },
    {
        id: 2,
        title: 'The Bear'
    },
    {
        id: 3,
        title: 'Stranger Things'
    },{
        id: 4,
        title: 'Stranger Things'
    },{
        id: 5,
        title: 'Stranger Things'
    },{
        id: 6,
        title: 'Stranger Things'
    },
    {
        id: 7,
        title: 'Stranger Things'
    },
    {
        id: 8,
        title: 'Stranger Things'
    },
];

export const Home = () => {
    return (
        <Box sx={{ p: 3 }}>

            <Box sx={{ p:3 }}>
                <ShowCarousel title="Trending" shows={shows} />
                <ShowCarousel title="Up Next" shows={shows} />
            </Box>

        </Box>
    )
}