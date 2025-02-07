"use client";
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";

const Dashboard: React.FC = () => {
  const airtekLinks = [
    {
      title: "Airtek Warranty Registration Page",
      url: "https://next-nine-pied.vercel.app/",
    },
    {
      title: "Airtek Dealer Info",
      url: "https://next-nine-pied.vercel.app/dealer-data/dealer-info",
    },
    {
      title: "Airtek Inventory",
      url: "https://next-nine-pied.vercel.app/inventory",
    },
    {
      title: "Airtek Warranty Claim Details",
      url: "https://next-nine-pied.vercel.app/warranty-claim-details",
    },
    {
      title: "Submit Airtek Credit Email",
      url: "https://next-nine-pied.vercel.app/submit-credit-email",
    },
  ];

  const sorenoLinks = [
    {
      title: "Soreno Blogs Management",
      url: "https://next-nine-pied.vercel.app/blogs",
    },
    {
      title: "Submit Soreno Credit Email",
      url: "https://next-nine-pied.vercel.app/soreno-credit-email",
    },
  ];

  const widgetLinks = [
    {
      title: "Barcode Scanner",
      url: "https://scan-barcode-rho.vercel.app/",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Dashboard
        </Typography>
        <Typography variant="body1" paragraph textAlign="center">
          Welcome! Choose a function to proceed:
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Airtek
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {airtekLinks.map((link, index) => (
              <ListItem key={index} disableGutters>
                <ListItemButton
                  component="a"
                  href={link.url}
                  target="_blank"
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.title}
                    primaryTypographyProps={{ color: "primary" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Soreno
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {sorenoLinks.map((link, index) => (
              <ListItem key={index} disableGutters>
                <ListItemButton
                  component="a"
                  href={link.url}
                  target="_blank"
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.title}
                    primaryTypographyProps={{ color: "primary" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
            Widget
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List disablePadding>
            {widgetLinks.map((link, index) => (
              <ListItem key={index} disableGutters>
                <ListItemButton
                  component="a"
                  href={link.url}
                  target="_blank"
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.title}
                    primaryTypographyProps={{ color: "primary" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
