import React from "react";
import { Box } from "@mui/material";

const MapSection = () => {
  return (
    <Box sx={{ width: "100%", height: "60dvh", my: 4 }} data-aos="fade-up">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3865.884917845832!2d120.92684427530057!3d14.318116786135468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d578c5cbe87f%3A0xdab606411d10f52c!2sJohn%20Cezar%20Waterfun%20Resort%20and%20Event%20Hall!5e0!3m2!1sen!2sph!4v1757868741755!5m2!1sen!2sph"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="JC Waterfun Resort Location"
      ></iframe>
    </Box>
  );
};

export default MapSection;
