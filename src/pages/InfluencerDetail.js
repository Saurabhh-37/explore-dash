import React, { useState, useEffect } from "react";
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
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Function to get color based on trust score
const getCircularProgressColor = (trustScore) => {
  if (trustScore >= 70) return "green";
  if (trustScore >= 40) return "yellow";
  return "red";
};

const InfluencerDetail = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [influencers, setInfluencers] = useState([]);
  const [selectedInfluencer, setSelectedInfluencer] = useState("");
  const [influencerData, setInfluencerData] = useState(null);
  const [filteredClaims, setFilteredClaims] = useState([]);

  // Example influencer data
  const influencersData = {
    name: "Dr. Andrew Huberman",
    description: "Neuroscientist and professor at Stanford University.",
    trustScore: 85, // trust score (percentage)
    yearlyRevenue: 50000,
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
      {
        claim: "Eating late at night causes weight gain.",
        verification_status: {
          status: "Questionable",
          trust_score: "50%",
          reason: "The evidence is mixed; more research is needed to confirm this claim.",
        },
      },
    ],
  };

  useEffect(() => {
    // Fetch all influencer documents from Firestore
    const fetchInfluencers = async () => {
      const influencerCollection = collection(db, "VerifiedClaims");
      const influencerSnapshot = await getDocs(influencerCollection);
      const influencerList = influencerSnapshot.docs.map((doc) => doc.id); // Get all influencer ids
      setInfluencers(influencerList);
    };

    fetchInfluencers();
  }, []);

  useEffect(() => {
    const fetchInfluencerData = async () => {
      if (!selectedInfluencer) return;
  
      const docRef = doc(db, "VerifiedClaims", selectedInfluencer);
      const docSnapshot = await getDoc(docRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log("Fetched Data:", data);
  
        // Extracting claimsHistory -> verifiedClaims
        const allClaims = data.claimsHistory.flatMap(history => history.verifiedClaims);
        console.log("Extracted Claims:", allClaims);
  
        setFilteredClaims(allClaims);
      } else {
        console.log("No document found for this influencer.");
        setFilteredClaims([]);
      }
    };
  
    fetchInfluencerData();
  }, [selectedInfluencer]);
  
  const calculateAverageTrustScore = () => {
    if (!filteredClaims.length) return 0;
    const totalTrustScore = filteredClaims.reduce(
      (sum, claim) => sum + parseInt(claim.verification_status.trust_score || 0),
      0
    );
    return Math.round(totalTrustScore / filteredClaims.length);
  };
  

  // Filter claims based on verification status
  // const filteredClaims = influencersData.claims.filter((claim) => {
  //   return statusFilter === "All" || claim.verification_status.status === statusFilter;
  // });

  return (
    <Container>
      {/* <Paper sx={{ p: 3, mt: 2 }}> */}
        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 2 }}>
        <FormControl fullWidth>
  <InputLabel>Choose Influencer</InputLabel>
  <Select
    value={selectedInfluencer}
    label="Choose Influencer"
    onChange={(e) => {
      // console.log("Selected Influencer Value:", e.target.value);  // Log selected influencer value
      setSelectedInfluencer(e.target.value);
    }}
  >
    {influencers.map((influencer) => (
      <MenuItem key={influencer} value={influencer}>
        {influencer}
      </MenuItem>
    ))}
  </Select>
</FormControl>

      </Box>

      {influencerData && (
        <>
        {/* Profile Section */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 2 }}>
            <Box>
              <Typography variant="h5">{selectedInfluencer}</Typography>
              <Typography variant="body2" color="textSecondary">
                {influencerData.description}
              </Typography>
            </Box>
          </Box>
        </>
      )}
        <Divider sx={{ mb: 3 }} />

        {/* Revenue, Followers and Trust Score in Cards using Box */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          {/* Yearly Revenue Card */}
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  ${influencersData.yearlyRevenue.toLocaleString()}
                </Typography>
                <Typography variant="h6">Yearly Revenue</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Followers Card */}
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {influencersData.followers.toLocaleString()}
                </Typography>
                <Typography variant="h6">Followers</Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Trust Score Card */}
          <Box sx={{ width: "30%" }}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {calculateAverageTrustScore()}%
                </Typography>
                <Typography variant="h6">Trust Score</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Claims Filter Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filter by Verification Status
          </Typography>
          <Chip
            label="All"
            color={statusFilter === "All" ? "primary" : "default"}
            onClick={() => setStatusFilter("All")}
            sx={{ mr: 1 }}
          />
          <Chip
            label="Verified"
            color={statusFilter === "Verified" ? "primary" : "default"}
            onClick={() => setStatusFilter("Verified")}
            sx={{ mr: 1 }}
          />
          <Chip
            label="Debunked"
            color={statusFilter === "Debunked" ? "primary" : "default"}
            onClick={() => setStatusFilter("Debunked")}
            sx={{ mr: 1 }}
          />
          <Chip
            label="Questionable"
            color={statusFilter === "Questionable" ? "primary" : "default"}
            onClick={() => setStatusFilter("Questionable")}
            sx={{ mr: 1 }}
          />
        </Box>

        {/* Claims Table */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Claims Analysis
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
  {filteredClaims
    .filter((claim) => statusFilter === "All" || claim.verification_status.status === statusFilter)
    .map((claim, index) => {
      const trustScore = parseInt(claim.verification_status.trust_score);
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
                  left: "-10%",
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
      {/* </Paper> */}
    </Container>
  );
};

export default InfluencerDetail;
