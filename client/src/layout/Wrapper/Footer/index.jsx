import { Box, Container, Typography, Link, Skeleton, Grid } from "@mui/material";
import { useGetResortDetails } from "api/resort-details";
import React from "react";

const Footer = () => {
  const { resortDetails, isLoading } = useGetResortDetails();

  const {
    name,
    address,
    phoneNumber,
    emailAddress,
  } = resortDetails?.companyInfo || {};

  const {
    streetAddress,
    city,
    province,
    country,
  } = address || {};

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#004b80",
        color: "#fff",
        fontFamily: "Istok Web, sans-serif",
        py: 4,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffdd00",
                mb: 1,
                borderBottom: "1px solid #ffdd00",
                display: "inline-block",
                fontSize: "20px",
                fontFamily: "Cinzel, serif",
              }}
            >
              Discover
            </Typography>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Typography fontSize="14px" fontFamily="Istok Web, sans-serif">
                  #WatermazingExperience
                </Typography>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffdd00",
                mb: 1,
                borderBottom: "1px solid #ffdd00",
                display: "inline-block",
                fontSize: "20px",
                fontFamily: "Cinzel, serif",
              }}
            >
              Resort Info
            </Typography>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { label: "Rules & Regulations", href: "rules-regulations" },
                { label: "Amenities", href: "amenities" },
              ].map((item) => (
                <li key={item.label} style={{ lineHeight: 1.8 }}>
                  <Link
                    href={item.href}
                    sx={{
                       color: "#fff",
                       fontSize: "14px",
                       fontFamily: "Istok Web, sans-serif",
                       textDecoration: "none",
                       "&:hover": { textDecoration: "underline" },
              }}
             >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffdd00",
                mb: 1,
                borderBottom: "1px solid #ffdd00",
                display: "inline-block",
                fontSize: "20px",
                fontFamily: "Cinzel, serif",
              }}
            >
              About Us
            </Typography>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
             {[
               { label: "Contact Us", href: "contact-us" },
               { label: "Media", href: "media" },
               { label: "FAQs", href: "faqs" },
               { label: "Privacy Policy", href: "privacy-policy" },
             ].map((item) => (
               <li key={item.label} style={{ lineHeight: 1.8 }}>
                 <Link
                    href={item.href}
                    sx={{
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "Istok Web, sans-serif",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                 >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffdd00",
                mb: 1,
                borderBottom: "1px solid #ffdd00",
                display: "inline-block",
                fontSize: "20px",
                fontFamily: "Cinzel, serif",
              }}
            >
              Contact Information
            </Typography>

            {isLoading ? (
              <Box>
                <Skeleton width="80%" height={20} sx={{ bgcolor: "grey.700" }} />
                <Skeleton width="60%" height={20} sx={{ bgcolor: "grey.700" }} />
                <Skeleton width="70%" height={20} sx={{ bgcolor: "grey.700" }} />
              </Box>
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  lineHeight: 1.8,
                  fontSize: "14px",
                  fontFamily: "Istok Web, sans-serif",
                }}
              >
                📍 {[streetAddress, city, province, country].filter(Boolean).join(", ")} <br />
                ☎ {phoneNumber} <br />
                ✉ {emailAddress}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Box
          sx={{
            textAlign: "center",
            borderTop: "1px solid #333",
            mt: 4,
            pt: 2,
          }}
        >
          {isLoading ? (
            <Skeleton
              width="50%"
              height={16}
              sx={{ bgcolor: "grey.700", mx: "auto" }}
            />
          ) : (
            <Typography
              sx={{
                m: "2px 0",
                fontSize: "12px",
                fontFamily: "Istok Web, sans-serif",
              }}
            >
              © {name}. All rights reserved.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
