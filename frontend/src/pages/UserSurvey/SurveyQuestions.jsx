import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SurveyShell from "./SurveyShell";
import { SURVEY_TOKENS } from "./surveyTokens";
import { useNavigate } from "react-router-dom";
import { useSurvey } from "./SurveyContext";

const insuranceProviders = [
  { value: "aetna-student", label: "Aetna Student Health" },
  { value: "anthem-bcbs", label: "Anthem BlueCross BlueShield" },
  { value: "kaiser", label: "Kaiser Permanente" },
  { value: "uhc", label: "UnitedHealthcare" },
  { value: "cigna", label: "Cigna" },
  { value: "other", label: "Other / International" },
];

function QuestionCard({ children }) {
  const { colors, radii, shadows } = SURVEY_TOKENS;
  return (
    <Paper
      elevation={0}
      component={motion.div}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      sx={{
        borderRadius: radii.cardInner,
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        boxShadow: "0 10px 30px rgba(44, 36, 32, 0.06)",
        background: `linear-gradient(180deg, ${colors.beige} 0%, ${colors.beige2} 100%)`,
      }}
    >
      {/* Two-tone strata: subtle dark header + light body */}
      <Box
        sx={{
          bgcolor: "rgba(44, 36, 32, 0.04)",
          borderBottom: "1px solid rgba(44, 36, 32, 0.06)",
          px: { xs: 3, md: 4 },
          py: 2.5,
        }}
      />
      <Box sx={{ px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </Paper>
  );
}

export default function SurveyQuestions() {
  const navigate = useNavigate();
  const { data, set } = useSurvey();
  const { colors, fontMain, radii } = SURVEY_TOKENS;

  const steps = useMemo(
    () => [
      { key: "what", label: "What happened?" },
      { key: "when", label: "When did it happen?" },
      { key: "insurance", label: "Do you have insurance?" },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const active = steps[index];
  const progress = ((index + 1) / steps.length) * 100;

  // Smooth cursor/tab flow: focus first interactive element per card
  const focusRef = useRef(null);
  useEffect(() => {
    const t = setTimeout(() => {
      focusRef.current?.focus?.();
    }, 50);
    return () => clearTimeout(t);
  }, [index]);

  const goNext = () => {
    if (index < steps.length - 1) setIndex((i) => i + 1);
    else navigate("/survey/end");
  };

  const goSkip = () => {
    goNext();
  };

  return (
    <SurveyShell>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: fontMain,
              fontWeight: 800,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
              letterSpacing: "-0.04em",
              color: colors.textMain,
              lineHeight: 1.1,
              mb: 1,
            }}
          >
            A few quick questions
          </Typography>
          <Typography
            sx={{
              fontFamily: fontMain,
              color: colors.textSec,
              fontSize: "1.02rem",
              lineHeight: 1.7,
              maxWidth: 820,
            }}
          >
            Answer as much or as little as you’d like — this simply helps us
            understand where you’re starting from.
          </Typography>
        </Box>

        {/* Progress */}
        <Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: radii.pill,
              bgcolor: "rgba(44,36,32,0.08)",
              "& .MuiLinearProgress-bar": { bgcolor: colors.deepBrown },
            }}
            aria-label={`Question ${index + 1} of ${steps.length}`}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.85rem",
              }}
            >
              Question {index + 1} of {steps.length}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontMain,
                color: colors.textSec,
                fontSize: "0.85rem",
              }}
            >
              {active.label}
            </Typography>
          </Box>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <QuestionCard>
              {active.key === "what" && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      fontWeight: 700,
                      color: colors.textMain,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                      mb: 1,
                    }}
                  >
                    What happened?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      color: colors.textSec,
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 780,
                    }}
                  >
                    Briefly describe your injury or situation. You can keep it
                    high level — this helps us anchor your journey.
                  </Typography>

                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <RadioGroup
                      value={data.whatHappened}
                      onChange={(e) => set({ whatHappened: e.target.value })}
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontFamily: fontMain,
                          color: colors.textMain,
                        },
                        "& .MuiRadio-root.Mui-checked": {
                          color: colors.accent,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="sports"
                        control={<Radio inputRef={focusRef} />}
                        label="Sports or training injury"
                      />
                      <FormControlLabel
                        value="accident"
                        control={<Radio />}
                        label="Accidental fall or impact"
                      />
                      <FormControlLabel
                        value="medical"
                        control={<Radio />}
                        label="Medical procedure / condition"
                      />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>

                  {data.whatHappened === "other" && (
                    <TextField
                      fullWidth
                      placeholder="Optional: share anything you’d like us to know."
                      value={data.whatHappenedOther}
                      onChange={(e) => set({ whatHappenedOther: e.target.value })}
                      sx={{
                        mt: 2,
                        "& .MuiOutlinedInput-root": {
                          fontFamily: fontMain,
                          borderRadius: "12px",
                          bgcolor: "rgba(255,255,255,0.45)",
                          "& fieldset": { borderColor: colors.border },
                          "&:hover fieldset": { borderColor: "#C8B9AF" },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.deepBrown,
                            borderWidth: "1.5px",
                          },
                        },
                      }}
                      inputRef={focusRef}
                    />
                  )}
                </Box>
              )}

              {active.key === "when" && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      fontWeight: 700,
                      color: colors.textMain,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                      mb: 1,
                    }}
                  >
                    When did it happen?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      color: colors.textSec,
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 780,
                    }}
                  >
                    This helps us understand where you might be in your recovery
                    timeline.
                  </Typography>

                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <RadioGroup
                      value={data.whenHappened}
                      onChange={(e) =>
                        set({ whenHappened: e.target.value, whenHappenedDetail: "" })
                      }
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontFamily: fontMain,
                          color: colors.textMain,
                        },
                        "& .MuiRadio-root.Mui-checked": {
                          color: colors.accent,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="today"
                        control={<Radio inputRef={focusRef} />}
                        label="Today"
                      />
                      <FormControlLabel
                        value="this-week"
                        control={<Radio />}
                        label="Within the last week"
                      />
                      <FormControlLabel
                        value="older"
                        control={<Radio />}
                        label="More than a week ago"
                      />
                    </RadioGroup>
                  </FormControl>

                  {data.whenHappened === "older" && (
                    <Box sx={{ mt: 2.5 }}>
                      <Divider sx={{ borderColor: "rgba(44,36,32,0.10)", mb: 2.5 }} />
                      <Typography
                        sx={{
                          fontFamily: fontMain,
                          color: colors.textSec,
                          fontSize: "0.9rem",
                          mb: 1.5,
                        }}
                      >
                        If you want, choose a little more detail.
                      </Typography>
                      <FormControl component="fieldset" sx={{ width: "100%" }}>
                        <RadioGroup
                          value={data.whenHappenedDetail}
                          onChange={(e) => set({ whenHappenedDetail: e.target.value })}
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontFamily: fontMain,
                              color: colors.textMain,
                            },
                            "& .MuiRadio-root.Mui-checked": {
                              color: colors.accent,
                            },
                          }}
                        >
                          <FormControlLabel value="1-4-weeks" control={<Radio />} label="1–4 weeks ago" />
                          <FormControlLabel value="1-3-months" control={<Radio />} label="1–3 months ago" />
                          <FormControlLabel value="more-3-months" control={<Radio />} label="More than 3 months ago" />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  )}
                </Box>
              )}

              {active.key === "insurance" && (
                <Box>
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      fontWeight: 700,
                      color: colors.textMain,
                      fontSize: "1.25rem",
                      letterSpacing: "-0.02em",
                      mb: 1,
                    }}
                  >
                    Do you have insurance?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fontMain,
                      color: colors.textSec,
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      mb: 3,
                      maxWidth: 780,
                    }}
                  >
                    This helps us think about budget-friendly options and which
                    resources might fit best. You can skip this.
                  </Typography>

                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <RadioGroup
                      value={data.hasInsurance}
                      onChange={(e) =>
                        set({ hasInsurance: e.target.value, insuranceProvider: "" })
                      }
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontFamily: fontMain,
                          color: colors.textMain,
                        },
                        "& .MuiRadio-root.Mui-checked": {
                          color: colors.accent,
                        },
                      }}
                    >
                      <FormControlLabel
                        value="yes"
                        control={<Radio inputRef={focusRef} />}
                        label="Yes"
                      />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>

                  {data.hasInsurance === "yes" && (
                    <Box sx={{ mt: 2.5, maxWidth: 480 }}>
                      <Typography
                        sx={{
                          fontFamily: fontMain,
                          color: colors.textSec,
                          fontSize: "0.9rem",
                          mb: 1,
                        }}
                      >
                        Select your plan (common Emory options).
                      </Typography>
                      <Select
                        fullWidth
                        value={data.insuranceProvider}
                        onChange={(e) => set({ insuranceProvider: e.target.value })}
                        displayEmpty
                        sx={{
                          fontFamily: fontMain,
                          borderRadius: "12px",
                          bgcolor: "rgba(255,255,255,0.45)",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.border,
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C8B9AF",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: colors.deepBrown,
                            borderWidth: "1.5px",
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Prefer not to say</em>
                        </MenuItem>
                        {insuranceProviders.map((p) => (
                          <MenuItem key={p.value} value={p.value}>
                            {p.label}
                          </MenuItem>
                        ))}
                      </Select>

                      <Button
                        variant="text"
                        size="small"
                        startIcon={<SkipNextIcon />}
                        onClick={() => navigate("/home")}
                        sx={{
                          mt: 1.5,
                          fontFamily: fontMain,
                          textTransform: "none",
                          color: colors.textSec,
                          "&:hover": { color: colors.textMain, bgcolor: "transparent" },
                        }}
                      >
                        Skip insurance and go to Questions Loop
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </QuestionCard>
          </motion.div>
        </AnimatePresence>

        <Box
          sx={{
            mt: 0.5,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="text"
            onClick={goSkip}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              textTransform: "none",
              color: colors.textSec,
              "&:hover": { color: colors.textMain, bgcolor: "transparent" },
            }}
          >
            Skip
          </Button>
          <Button
            variant="contained"
            onClick={goNext}
            endIcon={index === steps.length - 1 ? <DoneAllIcon /> : <ArrowForwardIcon />}
            sx={{
              fontFamily: fontMain,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: radii.button,
              px: 4.5,
              py: 1.6,
              bgcolor: colors.deepBrown,
              color: "#FFF",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#1a1614",
                transform: "translateY(-2px)",
              },
            }}
          >
            {index === steps.length - 1 ? "Finish Survey" : "Next"}
          </Button>
        </Box>
      </Box>
    </SurveyShell>
  );
}

