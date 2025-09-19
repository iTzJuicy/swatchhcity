import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Button,
  Container,
  Paper,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RecyclingIcon from "@mui/icons-material/Recycling";

export default function RewardsCredits() {
  const [credits, setCredits] = useState(120);

  const earnReward = (action) => {
    if (action === "report") {
      setCredits((prev) => prev + 10);
    } else if (action === "segregate") {
      setCredits((prev) => prev + 20);
    } else if (action === "cleanup") {
      setCredits((prev) => prev + 30);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        backgroundColor: "#F9F9F9",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        {/* Main Heading */}
        <Typography
          variant="h5"
          fontWeight={700}
          mb={1}
          sx={{ color: "#2E7D32", textAlign: "center" }}
        >
          CREDIT POINTS
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          mb={3}
          sx={{ color: "#555", fontWeight: 500, textAlign: "center" }}
        >
          Track your green journey & see your eco impact.
        </Typography>

        {/* Smaller Green Credits Card */}
        <Card
          sx={{
            p: 2,
            textAlign: "center",
            boxShadow: 5,
            borderRadius: 4,
            backgroundColor: "#fff",
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "gold",
              mx: "auto",
              mb: 1.5,
              width: 60,
              height: 60,
            }}
          >
            <StarIcon sx={{ fontSize: 35, color: "#343A40" }} />
          </Avatar>
          <Typography variant="subtitle1" fontWeight={600} color="#343A40">
            Your Green Credits
          </Typography>
          <Typography variant="h3" fontWeight={700} color="#2E8B57">
            {credits}
          </Typography>
          <Typography sx={{ mt: 1, color: "#6C757D" }}>
            Eco Warrior 🌍
          </Typography>
          <Box
            sx={{
              mt: 1.5,
              height: 8,
              borderRadius: 5,
              bgcolor: "#E9ECEF",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: ${(credits / 200) * 100}%,
                height: "100%",
                bgcolor: "#2E8B57",
                transition: "width 0.5s ease-in-out",
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 0.5, color: "#6C757D" }}
          >
            {credits}/200 Credits to next level
          </Typography>
        </Card>

        {/* Buttons inside grey box */}
        <Paper
          elevation={1}
          sx={{
            backgroundColor: "#E0E0E0",
            p: 3,
            borderRadius: 2,
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#555", mb: 2 }}
          >
            Earn rewards by contributing:
          </Typography>
          <Button
            variant="contained"
            sx={{
              m: 1,
              bgcolor: "#4682B4",
              "&:hover": { bgcolor: "#36648B" },
            }}
            onClick={() => earnReward("report")}
          >
            Report Issue
          </Button>
          <Button
            variant="contained"
            sx={{
              m: 1,
              bgcolor: "#2E8B57",
              "&:hover": { bgcolor: "#246b45" },
            }}
            onClick={() => earnReward("segregate")}
            startIcon={<RecyclingIcon />}
          >
            Segregate Waste
          </Button>
          <Button
            variant="contained"
            sx={{
              m: 1,
              bgcolor: "#FFD700",
              color: "#000",
              "&:hover": { bgcolor: "#e6c200" },
            }}
            onClick={() => earnReward("cleanup")}
          >
            Join Cleanup
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}