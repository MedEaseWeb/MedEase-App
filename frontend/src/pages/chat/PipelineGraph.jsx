import React from "react";
import { Box, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const colors = {
  cardBg: "#F5F0EB",
  border: "#E6DCCA",
  textMain: "#2C2420",
  textSec: "#594D46",
  accent: "#A65D37",
  sidebarBg: "#E2DCD5",
};
const fontMain = "'Plus Jakarta Sans', sans-serif";

function StepDot({ state }) {
  if (state === "done") {
    return (
      <Box sx={{
        width: 18, height: 18, borderRadius: "50%",
        bgcolor: "#00684A", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#fff" }} />
      </Box>
    );
  }
  if (state === "blocked") {
    return (
      <Box sx={{
        width: 18, height: 18, borderRadius: "50%",
        bgcolor: "#C0392B", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Box sx={{ width: 8, height: 2, bgcolor: "#fff", borderRadius: 1 }} />
      </Box>
    );
  }
  if (state === "running") {
    return (
      <Box sx={{
        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
        border: `2.5px solid ${colors.accent}`,
        borderTopColor: "transparent",
        animation: "pipelineSpin 0.7s linear infinite",
        "@keyframes pipelineSpin": { "100%": { transform: "rotate(360deg)" } },
      }} />
    );
  }
  return (
    <Box sx={{
      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
      border: `2px solid ${colors.border}`, bgcolor: colors.sidebarBg,
    }} />
  );
}

export default function PipelineGraph({ steps, open, onToggle }) {
  if (!steps || steps.length === 0) return null;

  return (
    <Box>
      <Box
        onClick={onToggle}
        sx={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          mb: open ? 1 : 0,
          cursor: "pointer", userSelect: "none",
        }}
      >
        <Typography sx={{
          fontFamily: fontMain, fontWeight: 600,
          fontSize: "0.7rem", letterSpacing: "0.08em",
          textTransform: "uppercase", color: colors.textSec,
        }}>
          Pipeline
        </Typography>
        {open
          ? <ExpandLess sx={{ fontSize: 16, color: colors.textSec }} />
          : <ExpandMore sx={{ fontSize: 16, color: colors.textSec }} />
        }
      </Box>

      <Collapse in={open}>
        <Box sx={{
          p: 1.5, borderRadius: "14px",
          bgcolor: colors.cardBg, border: `1px solid ${colors.border}`,
        }}>
          {steps.map((step, i) => (
            <Box key={step.id}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <StepDot state={step.state} />
                  {i < steps.length - 1 && (
                    <Box sx={{
                      width: "1.5px", minHeight: 10, flex: 1,
                      bgcolor: colors.border, mt: "3px", mb: "3px",
                    }} />
                  )}
                </Box>

                <Box sx={{ flex: 1, pb: i < steps.length - 1 ? 1 : 0 }}>
                  <Typography sx={{
                    fontFamily: fontMain, fontSize: "0.8rem", lineHeight: 1.3,
                    fontWeight: step.state === "running" ? 600 : 500,
                    color: step.state === "blocked" ? "#C0392B" : colors.textMain,
                    opacity: step.state === "pending" ? 0.4 : 1,
                  }}>
                    {step.label}
                  </Typography>

                  {step.docs && step.docs.length > 0 && (
                    <Box sx={{ mt: 0.5, display: "flex", flexDirection: "column", gap: 0.3 }}>
                      {step.docs.map((doc, j) => (
                        <Typography key={j} sx={{
                          fontFamily: fontMain, fontSize: "0.71rem",
                          color: colors.accent, opacity: 0.85, lineHeight: 1.35,
                          display: "flex", alignItems: "flex-start", gap: 0.4,
                        }}>
                          <Box component="span" sx={{ opacity: 0.55, flexShrink: 0 }}>↳</Box>
                          {doc}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
