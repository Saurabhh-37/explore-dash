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
import { db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const ResearchConfig = () => {
  const [influencer, setInfluencer] = useState("");
  const [claims, setClaims] = useState([]);
  const [verified, setVerified] = useState(false);

  const handleSearch = async () => {
    if (!influencer) {
      console.error("Influencer name is required");
      return;
    }

    try {
      const response = await fetch("https://asia-south1-gen-lang-client-0991694437.cloudfunctions.net/VerifyInfluencers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ influencer }), // Sending influencer name to backend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full Backend Response:", data);

      // Extract key details
      const extractedClaims = data.extracted_health_claims || [];
      const verifiedClaims = Array.isArray(data.verified_health_claims)
        ? data.verified_health_claims.flatMap(group => group.verified_health_claims) || []
        : [];

      console.log("Extracted Health Claims:", extractedClaims);
      console.log("Verified Health Claims:", verifiedClaims);

      // Firestore document reference
      const docRef = doc(db, "VerifiedClaims", influencer);

      // Check if the influencer document exists
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Append new claims to the existing document
        await updateDoc(docRef, {
          claimsHistory: arrayUnion({
            verifiedClaims,
            timestamp: new Date().toISOString(),
          }),
        });
        console.log("New data successfully appended to Firestore");
      } else {
        // Create a new document for the influencer
        await setDoc(docRef, {
          influencer,
          claimsHistory: [
            {
              verifiedClaims,
              timestamp: new Date().toISOString(),
            },
          ],
        });
        console.log("New influencer document created in Firestore");
      }

      // Update state to display claims
      setClaims(verifiedClaims);

    } catch (error) {
      console.error("Error fetching or storing data:", error);
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
                        left: "-10%",
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
