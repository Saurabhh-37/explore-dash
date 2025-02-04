import React from "react";
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
  return (
    <Container>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4">Leaderboard</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          List ranked by score.
        </Typography>

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
              {leaderboardData.map((influencer, index) => {
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
      </Paper>
    </Container>
  );
};

export default Leaderboard;
