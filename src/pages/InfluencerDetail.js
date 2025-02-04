import React from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

// Function to get color based on trust score
const getCircularProgressColor = (trustScore) => {
  if (trustScore >= 70) return "green";
  if (trustScore >= 40) return "yellow";
  return "red";
};

const InfluencerDetail = () => {
  // Example influencer data
  const influencerData = {
    name: "Dr. Andrew Huberman",
    description: "Neuroscientist and professor at Stanford University.",
    trustScore: 85, // trust score (percentage)
    yearlyRevenue: 500000,
    followers: 1000000,
    claims: [
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
        claim: "Intermittent fasting improves cognitive function.",
        verification_status: {
          status: "Verified",
          trust_score: "78%",
          reason: "Several studies show cognitive benefits of intermittent fasting.",
        },
      },
    ],
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mt: 2 }}>
        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5">{influencerData.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {influencerData.description}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Revenue, Followers and Trust Score in Cards using Box */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          {/* Yearly Revenue Card */}
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Yearly Revenue</Typography>
                <Typography variant="h4" color="primary">
                  ${influencerData.yearlyRevenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Followers Card */}
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Followers</Typography>
                <Typography variant="h4" color="primary">
                  {influencerData.followers.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Trust Score Card */}
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Trust Score</Typography>
                <Typography variant="h4" color="primary">
                  {influencerData.trustScore}%
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Claims Table */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Claims with Verification Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Claim</TableCell>
                <TableCell>Verification Status</TableCell>
                <TableCell>Trust Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {influencerData.claims.map((claim, index) => {
                const trustScore = parseInt(claim.verification_status.trust_score); // Convert trust score to integer
                return (
                  <TableRow key={index}>
                    <TableCell>{claim.claim}</TableCell>
                    <TableCell>{claim.verification_status.status}</TableCell>
                    <TableCell>
                      <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <CircularProgress
                          variant="determinate"
                          value={trustScore}
                          size={30}
                          thickness={4}
                          sx={{
                            ml: 2,
                            color: getCircularProgressColor(trustScore),
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default InfluencerDetail;
