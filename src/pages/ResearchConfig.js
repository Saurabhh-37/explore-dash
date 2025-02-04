import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from "@mui/material";

const ResearchConfig = () => {
  const [influencer, setInfluencer] = useState("");
  const [claims, setClaims] = useState([]);
  const [verified, setVerified] = useState(false);

  // Mock API data (replace with actual API call)
  const mockApiData = {
    influencer: "Dr. Andrew Huberman",
    verified_health_claims: [
      {
        claim: "Cold exposure can enhance dopamine levels.",
        verification_status: {
          status: "Verified",
          trust_score: "92%",
          reason: "Multiple studies confirm dopamine increase after cold exposure.",
        },
      },
      {
        claim: "Drinking alkaline water prevents cancer.",
        verification_status: {
          status: "Debunked",
          trust_score: "20%",
          reason: "No scientific evidence supports this claim; research contradicts it.",
        },
      },
      {
        claim: "Intermittent fasting promotes longevity.",
        verification_status: {
          status: "Verified",
          trust_score: "85%",
          reason: "Numerous studies suggest intermittent fasting has anti-aging effects.",
        },
      },
      {
        claim: "Taking vitamin D prevents COVID-19.",
        verification_status: {
          status: "Questionable",
          trust_score: "55%",
          reason: "Some studies show vitamin D may reduce the severity of symptoms, but more research is needed.",
        },
      },
      {
        claim: "Meditation can heal chronic diseases.",
        verification_status: {
          status: "Verified",
          trust_score: "78%",
          reason: "Scientific evidence supports meditation's role in improving mental and physical health.",
        },
      },
      {
        claim: "The law of attraction can manifest physical health.",
        verification_status: {
          status: "Debunked",
          trust_score: "30%",
          reason: "No scientific evidence supports the law of attraction's ability to manifest health outcomes.",
        },
      },
    ],
  };

  // Step 1: Handle influencer search and display claims
  const handleSearch = () => {
    if (influencer) {
      // Replace with actual API call to fetch claims for the influencer
      setClaims(mockApiData.verified_health_claims); // Setting mock data for now
    }
  };

  // Step 2: Handle verification button click to show detailed verification info
  const handleVerify = () => {
    setVerified(true);
  };

  // Function to get color based on trust score
  const getCircularProgressColor = (trustScore) => {
    if (trustScore >= 70) {
      return "green"; // Verified
    } else if (trustScore >= 40) {
      return "yellow"; // Questionable
    } else {
      return "red"; // Debunked
    }
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          Research Configuration
        </Typography>
        {/* <Typography variant="body1" gutterBottom>
          Pick date ranges and sources for analysis.
        </Typography> */}

        {/* Influencer Search Field */}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <TextField
            label="Enter Influencer Name"
            variant="outlined"
            fullWidth
            value={influencer}
            onChange={(e) => setInfluencer(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        {/* Claims List (without verification details initially) */}
        {influencer && claims.length > 0 && !verified && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Claims Made by {influencer}
            </Typography>
            <List>
              {claims.map((claim, index) => (
                <div key={index}>
                  <ListItem>
                    <ListItemText primary={claim.claim} />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleVerify}
              sx={{ mt: 2 }}
            >
              Verify Claims
            </Button>
          </Box>
        )}

        {/* Display Claims with Verification Details after 'Verify' button click */}
        {verified && claims.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Verified Claims by {influencer}
            </Typography>
            <List>
        {claims.map((claim, index) => {
          const trustScore = parseInt(claim.verification_status.trust_score); // Convert trust score to integer
          return (
            <div key={index}>
              <ListItem sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Claim text section */}
                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={claim.claim}
                    secondary={`Reason: ${claim.verification_status.reason}`}
                  />
                </Box>

                {/* Status section */}
                <Box sx={{ width: 150, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {claim.verification_status.status}
                  </Typography>
                </Box>

                {/* Trust score section with circular progress */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={trustScore}
                      size={50}
                      thickness={4}
                      sx={{
                        ml: 2,
                        color: getCircularProgressColor(trustScore), // Set color based on trust score
                      }}
                    />
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                      }}
                    >
                      {trustScore}%
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ResearchConfig;
