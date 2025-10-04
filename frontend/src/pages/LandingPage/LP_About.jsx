import React from "react";
import { Box, Typography, Grid, Skeleton } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function LP_About() {
  const members = [
    { name: "Annie He", role: "/" },
    { name: "Peter Chen", role: "/" },
    { name: "Sixing Wu", role: "/" },
    { name: "Vera Wen", role: "/" },
    { name: "Yuxuan Shi", role: "/" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
        background: "transparent", // transparent main wrapper
        fontFamily: "ECA, sans-serif",
      }}
    >
      {/* ===== Motivation Section ===== */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          px: { xs: 3, md: 8 },
          maxWidth: "1200px",
          mx: "auto",
          background: "transparent", // transparent content block
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={8} sx={{ background: "transparent" }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: "bold",
              color: "#0f4038",
              mb: 2,
            }}
          >
            Why We Started
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "ECA, sans-serif",
              color: "#4f665f",
              maxWidth: 720,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            MedEase was born from a deeply personal journey of navigating
            recovery as a student — balancing school, work, and healing without
            enough support.
          </Typography>
        </Box>

        {/* Story Part 1 */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          mb={8}
          sx={{ background: "transparent" }}
        >
          <Grid item xs={12} md={6}>
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                height: 300,
                borderRadius: 4,
                bgcolor: "rgba(231, 241, 236, 0.6)", // translucent skeleton tint
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "ECA, sans-serif",
                color: "#00684A",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              It Started with an Injury
            </Typography>
            <Typography
              sx={{
                fontFamily: "ECA, sans-serif",
                color: "#333",
                lineHeight: 1.7,
              }}
            >
              During one of the most demanding seasons of college — juggling
              internships, classes, and life as an international student — I
              suffered a Muay Thai injury that left me unable to walk for
              months. I didn’t take medical leave. Like many students, I kept
              pushing forward — navigating stairs, long walks, and deadlines,
              all while recovering alone.
            </Typography>
          </Grid>
        </Grid>

        {/* Story Part 2 */}
        <Grid
          container
          spacing={6}
          alignItems="center"
          flexDirection={{ xs: "column-reverse", md: "row" }}
          sx={{ background: "transparent" }}
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "ECA, sans-serif",
                color: "#00684A",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Turning Pain into Purpose
            </Typography>
            <Typography
              sx={{
                fontFamily: "ECA, sans-serif",
                color: "#333",
                lineHeight: 1.7,
              }}
            >
              That experience made something clear: recovery shouldn’t be this
              hard. So we built MedEase — a digital care companion that
              simplifies medical language, connects students to campus and
              healthcare resources, and provides emotional support during
              recovery. We want every student to heal confidently, with clarity
              and compassion.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100%",
                height: 300,
                borderRadius: 4,
                bgcolor: "rgba(234, 243, 239, 0.6)", // translucent tint
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ===== Members Section ===== */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          px: { xs: 3, md: 8 },
          background: "transparent", // no white background
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Box textAlign="center" mb={8} sx={{ background: "transparent" }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "ECA, sans-serif",
              fontWeight: "bold",
              color: "#0f4038",
              mb: 2,
            }}
          >
            Meet the Team
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "ECA, sans-serif",
              color: "#4f665f",
              maxWidth: 700,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Our interdisciplinary team of Emory students combines healthcare,
            technology, and lived experience to reimagine the recovery
            experience for everyone.
          </Typography>
        </Box>

        <Grid
          container
          spacing={5}
          justifyContent="center"
          sx={{ background: "transparent" }}
        >
          {members.map((m, i) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                sx={{ textAlign: "center", background: "transparent" }}
              >
                <Skeleton
                  variant="circular"
                  width={140}
                  height={140}
                  sx={{
                    mx: "auto",
                    bgcolor: "rgba(232, 245, 240, 0.6)", // slightly transparent
                    mb: 2,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "ECA, sans-serif",
                    fontWeight: "bold",
                    color: "#004d3a",
                    fontSize: "1rem",
                  }}
                >
                  {m.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "ECA, sans-serif",
                    color: "#666",
                    fontSize: "0.85rem",
                  }}
                >
                  {m.role}
                </Typography>
              </MotionBox>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
