import { Box, Grid, Typography } from "@mui/material";
import { motion } from "framer-motion";

const why1 =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/15dfb7e2-9fd0-4d13-6f71-e5fb1b474b00/public";

const why2 =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/dfac53ed-5b83-4ea1-4a8e-ab5cc1e5c500/public";
const annieImg =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/956740c2-9996-4dba-cf5c-891d746bdb00/public";

const peterImg =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/c7292c14-03fb-465d-ad98-67f2b1ae6900/public";

const philImg =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/8c69b30d-5084-4a42-e880-aa7d272c8700/public";

const sixingImg =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/611620df-7b75-40d4-2f2d-a0c1c5575b00/public";

const veraImg =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/516996c2-d34f-4706-73d4-114402bf5000/public";

const yuxuanImg =
  "https://imagedelivery.net/luUTa6EFyOmipDilm9a3Jw/713b3229-8a9a-4faf-2c9c-85bb81303600/public";

const MotionBox = motion(Box);

export default function LP_About() {
  const members = [
    { name: "Annie He", role: "Team Member", img: annieImg },
    { name: "Peter Chen", role: "Team Member", img: peterImg },
    { name: "Sixing Wu", role: "Team Member", img: sixingImg },
    { name: "Vera Wen", role: "Team Member", img: veraImg },
    { name: "Yuxuan Shi", role: "Team Member", img: yuxuanImg },
    { name: "Phil Wolff", role: "Technical Mentor", img: philImg },
  ];

  const imageStyles = {
    width: "60%",
    display: "block",
    mx: "auto",
    height: { xs: "auto", md: 300 },
    objectFit: "cover",
    borderRadius: 4,
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
        background: "transparent",
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
          background: "transparent",
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
            <Box
              component="img"
              src={why1}
              alt="Student struggling with injury"
              sx={imageStyles}
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
              hard. So we built MedEase — a digital care companion that supports
              you through every step: from the moment you’re injured, to
              navigating the American medical system, to post-injury recovery.
              MedEase helps students access care confidently, affordably, and
              with the least pain, stress, and disruption to their daily lives.
              Our mission is simple: help every student heal with clarity,
              dignity, and compassion.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={why2}
              alt="Student struggling with injury"
              sx={imageStyles}
            />
          </Grid>
        </Grid>
      </Box>

      {/* ===== Members Section ===== */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          px: { xs: 3, md: 8 },
          background: "transparent",
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
            // Changed lg={2.4} to lg={2} so 6 items fit in one row (12/2=6)
            <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
              <MotionBox
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                sx={{ textAlign: "center", background: "transparent" }}
              >
                <Box
                  component="img"
                  src={m.img}
                  alt={m.name}
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mx: "auto",
                    mb: 2,
                    boxShadow: "0 8px 24px rgba(15, 64, 56, 0.15)",
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
