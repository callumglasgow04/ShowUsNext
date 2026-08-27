import { Box, IconButton, Typography } from "@mui/material";
import ShowCard from "../ShowCard/ShowCard";
import { useRef } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'


type Show = {
    id: number;
    title: string;
    // imageUrl: string;
};

type ShowCarouselProps = {
    title: string;
    shows: Show[];
}

const ShowCarousel = ({ title, shows }: ShowCarouselProps) => {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (amount: number) => {
        carouselRef.current?.scrollBy({
            left: amount,
            behavior: 'smooth',
        });
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                {title}
            </Typography>

            <Box sx={{ position: 'relative' }}>
                <IconButton
                    onClick={() => scroll(-500)}
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        zIndex: 1,
                    }}
                >
                    <ChevronLeftIcon />
                </IconButton>


                <Box
                    ref={carouselRef}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        pb: 1,

                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {shows.map((show) => (
                        <ShowCard key={show.id} show={show} />
                    ))}
                </Box>

                <IconButton
                    onClick={() => scroll(500)}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        zIndex: 1,
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Box>
        </Box>
    )
}
export default ShowCarousel;