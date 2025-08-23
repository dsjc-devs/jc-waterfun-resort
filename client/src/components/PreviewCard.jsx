import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

const PreviewCard = ({ sublinks = [], backgroundImage = "" }) => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        position: "relative",
        p: 0.5,
        width: 500,
        height: 300,
        borderRadius: 1,
        overflow: "hidden",
        color: (theme) => theme.palette.secondary.contrastText,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, .4)",
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: 'column',
          position: "relative",
          zIndex: 2,
          p: 3
        }}
      >
        {sublinks.map((item) => (
          <Typography
            onClick={() => navigate(`${item.link}`)}
            sx={{
              fontFamily: 'Istok Web',
              borderBottom: 1,
              width: "40%",
              transition: '.3s',
              my: 2,
              '&:hover': {
                cursor: "pointer",
                opacity: .7,
              }
            }}
          >
            {item.title}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default PreviewCard;
