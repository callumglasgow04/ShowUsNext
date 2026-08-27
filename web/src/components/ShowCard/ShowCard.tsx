
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import BreakingBadImg from '../../BreakingBadImg.jpg'

type Show = {
    id: number;
    title: string;
    // imageUrl: string;
};

type ShowCardProps = {
    show: Show;
}

const ShowCard = ({ show }: ShowCardProps) => {
    return (
        <Card sx={{ minWidth: 180 }}>
            <CardMedia
                component="img"
                image={BreakingBadImg}
                alt={show.title}
            />

            <CardContent>
                <Typography>{show.title}</Typography>
            </CardContent>
        </Card>
    );
}

export default ShowCard;