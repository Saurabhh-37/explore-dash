import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Chip,
  Card,
  CardContent,
} from "@mui/material";

// Sample data for the leaderboard with categories
const leaderboardData = [
  {
    name: "Dr. Andrew Huberman",
    trustScore: 85,
    followers: 1000000,
    claims: 5,
    category: "Mental Health",
  },
  {
    name: "Dr. Rhonda Patrick",
    trustScore: 90,
    followers: 800000,
    claims: 6,
    category: "Nutrition",
  },
  {
    name: "Dr. Joe Dispenza",
    trustScore: 75,
    followers: 1200000,
    claims: 8,
    category: "Mental Health",
  },
  {
    name: "Dr. David Sinclair",
    trustScore: 95,
    followers: 600000,
    claims: 4,
    category: "Medicine",
  },
];

// Function to get color based on trust score
const getCircularProgressColor = (trustScore) => {
  if (trustScore >= 70) return "green";
  if (trustScore >= 40) return "yellow";
  return "red";
};

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter leaderboard data based on the selected category
  const filteredData =
    selectedCategory === "All"
      ? leaderboardData
      : leaderboardData.filter((influencer) => influencer.category === selectedCategory);

  // Calculate Active Influencers, Claims Verified, and Average Trust Score
  const activeInfluencers = filteredData.length;
  const totalClaims = filteredData.reduce((sum, influencer) => sum + influencer.claims, 0);
  const averageTrustScore =
    filteredData.reduce((sum, influencer) => sum + influencer.trustScore, 0) / filteredData.length;

  // Function to handle chip click
  const handleChipClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Container sx={{mt: 2}}>
      {/* <Paper sx={{ p: 3, mt: 2 }}> */}
        <Typography variant="h4" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          List ranked by score.
        </Typography>

        {/* Display Cards Above Leaderboard */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
              <Typography variant="h4" color="primary">
                  {activeInfluencers}
                </Typography>
                <Typography variant="h6">Active Influencers</Typography>          
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {totalClaims}
                </Typography>
                <Typography variant="h6">Claims Verified</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {averageTrustScore.toFixed(2)}%
                </Typography>
                <Typography variant="h6">Average Trust Score</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Category Filter with Chips */}
        <Box sx={{ mb: 3 }}>
          {["All", "Mental Health", "Nutrition", "Medicine"].map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleChipClick(category)}
              color={selectedCategory === category ? "primary" : "default"}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
            />
          ))}
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Influencer</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Trust Score</TableCell>
                <TableCell>Followers</TableCell>
                <TableCell>Claims</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((influencer, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{influencer.name}</TableCell>
                    <TableCell>{influencer.category}</TableCell>
                    <TableCell>
                      <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <CircularProgress
                          variant="determinate"
                          value={influencer.trustScore}
                          size={30}
                          thickness={4}
                          sx={{
                            ml: 2,
                            color: getCircularProgressColor(influencer.trustScore),
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
                          {influencer.trustScore}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{influencer.followers.toLocaleString()}</TableCell>
                    <TableCell>{influencer.claims}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      {/* </Paper> */}
    </Container>
  );
};

export default Leaderboard;
