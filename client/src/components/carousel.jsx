import React from "react";
import Slider from "react-slick";
import { Box, Card, CardMedia} from "@mui/material";

import carouselItems from "./carousel-items/carouselItems";

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
};

const Carousel = () => {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <Slider {...settings}>
        {carouselItems.map((item, index) => (
          <Card key={index} sx={{ borderRadius: 0 }}>
            <CardMedia
              component="img"
              image={item.link}
              alt={item.title}
              sx={{
                width: '100%',
                height: '100vh',
                objectFit: 'cover'
              }}
            />
          </Card>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;
