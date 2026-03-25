import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicationIcon from "@mui/icons-material/Medication";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ScienceIcon from "@mui/icons-material/Science";
import HealingIcon from "@mui/icons-material/Healing";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { SURVEY_TOKENS } from "../UserSurvey/surveyTokens";
import NotesWeekView from "./NotesWeekView";
import { useTranslation } from "react-i18next";

const { colors, fontMain, radii } = SURVEY_TOKENS;


function getWeekDates(anchor) {
  const d = new Date(anchor);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(start);
    x.setDate(start.getDate() + i);
    return x;
  });
}

function isToday(date) {
  const t = new Date();
  return (
    date.getFullYear() === t.getFullYear() &&
    date.getMonth() === t.getMonth() &&
    date.getDate() === t.getDate()
  );
}

export default function NotesCalendar({ cardSx }) {
  const { t } = useTranslation();
  const eventTypeLabels = t("notes.calendar.eventTypes", { returnObjects: true });
  const EVENT_TYPES = [
    { value: "medical", label: eventTypeLabels[0], icon: MedicalServicesIcon, color: "rgba(166, 93, 55, 0.2)", border: colors.accent },
    { value: "medication", label: eventTypeLabels[1], icon: MedicationIcon, color: "rgba(166, 93, 55, 0.15)", border: colors.accent },
    { value: "rehab", label: eventTypeLabels[2], icon: FitnessCenterIcon, color: "rgba(89, 77, 70, 0.12)", border: colors.textSec },
    { value: "test", label: eventTypeLabels[3], icon: ScienceIcon, color: "rgba(166, 93, 55, 0.18)", border: colors.accent },
    { value: "recovery", label: eventTypeLabels[4], icon: HealingIcon, color: "rgba(89, 77, 70, 0.1)", border: colors.textSec },
  ];

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    dayIndex: 0,
    startHour: 9,
    endHour: 10,
    title: "",
    type: "medical",
  });

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);

  const handlePrevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };
  const handleNextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };
  const handleToday = () => setWeekStart(new Date());

  const openAdd = (dayIndex, startHour) => {
    setEditingId(null);
    setForm({
      dayIndex,
      startHour,
      endHour: Math.min(startHour + 1, 23),
      title: "",
      type: "medical",
    });
    setDialogOpen(true);
  };

  const openEdit = (ev) => {
    setEditingId(ev.id);
    setForm({
      dayIndex: ev.dayIndex,
      startHour: ev.startHour,
      endHour: ev.endHour,
      title: ev.title,
      type: ev.type,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...form, id: editingId } : e))
      );
    } else {
      setEvents((prev) => [...prev, { id: crypto.randomUUID(), ...form }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (editingId) setEvents((prev) => prev.filter((e) => e.id !== editingId));
    setDialogOpen(false);
  };

  const eventsByDay = useMemo(() => {
    const byDay = {};
    weekDates.forEach((_, i) => (byDay[i] = []));
    events.forEach((ev) => {
      if (byDay[ev.dayIndex]) byDay[ev.dayIndex].push(ev);
    });
    Object.keys(byDay).forEach((k) => byDay[k].sort((a, b) => a.startHour - b.startHour));
    return byDay;
  }, [events, weekDates]);

  const weekRangeLabel =
    weekDates.length === 7
      ? `${weekDates[0].toLocaleDateString("en-US", { month: "short" })} ${weekDates[0].getDate()} – ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : "";

  return (
    <Box sx={{ ...cardSx }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fontMain,
            fontWeight: 700,
            color: colors.textMain,
            fontSize: "1.1rem",
          }}
        >
          {weekRangeLabel}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            onClick={handlePrevWeek}
            sx={{ fontFamily: fontMain, textTransform: "none", color: colors.textSec }}
          >
            {t("notes.calendar.previous")}
          </Button>
          <Button
            size="small"
            onClick={handleToday}
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              color: colors.accent,
              fontWeight: 600,
            }}
          >
            {t("notes.calendar.today")}
          </Button>
          <Button
            size="small"
            onClick={handleNextWeek}
            sx={{ fontFamily: fontMain, textTransform: "none", color: colors.textSec }}
          >
            {t("notes.calendar.next")}
          </Button>
        </Box>
      </Box>

      <NotesWeekView
        weekDates={weekDates}
        eventsByDay={eventsByDay}
        eventTypes={EVENT_TYPES}
        onSlotClick={openAdd}
        onEventClick={openEdit}
        isToday={isToday}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mt: 2,
          pt: 2,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <Typography
          sx={{ fontFamily: fontMain, fontSize: "0.8rem", color: colors.textSec }}
        >
          {t("notes.calendar.eventTypesLabel")}
        </Typography>
        {EVENT_TYPES.map((t) => (
          <Box key={t.value} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <t.icon sx={{ fontSize: 16, color: colors.textSec }} />
            <Typography
              sx={{ fontFamily: fontMain, fontSize: "0.75rem", color: colors.textSec }}
            >
              {t.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: radii.cardInner, fontFamily: fontMain },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: fontMain, fontWeight: 700, color: colors.textMain }}
        >
          {editingId ? t("notes.calendar.editEvent") : t("notes.calendar.addEvent")}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label={t("notes.calendar.titleLabel")}
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            margin="dense"
            sx={{
              "& .MuiOutlinedInput-root": { fontFamily: fontMain },
              "& .MuiInputLabel-root": { fontFamily: fontMain },
            }}
          />
          <TextField
            select
            fullWidth
            label={t("notes.calendar.typeLabel")}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            margin="dense"
            sx={{
              "& .MuiOutlinedInput-root": { fontFamily: fontMain },
              "& .MuiInputLabel-root": { fontFamily: fontMain },
            }}
          >
            {EVENT_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value} sx={{ fontFamily: fontMain }}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              type="number"
              label={t("notes.calendar.startHour")}
              value={form.startHour}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  startHour: Math.max(0, Math.min(23, +e.target.value)),
                }))
              }
              inputProps={{ min: 0, max: 23 }}
              margin="dense"
              sx={{ "& .MuiOutlinedInput-root": { fontFamily: fontMain } }}
            />
            <TextField
              type="number"
              label={t("notes.calendar.endHour")}
              value={form.endHour}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  endHour: Math.max(0, Math.min(23, +e.target.value)),
                }))
              }
              inputProps={{ min: 0, max: 23 }}
              margin="dense"
              sx={{ "& .MuiOutlinedInput-root": { fontFamily: fontMain } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {editingId && (
            <Button
              onClick={handleDelete}
              color="error"
              sx={{
                fontFamily: fontMain,
                textTransform: "none",
                mr: "auto",
              }}
              startIcon={<DeleteOutlineIcon />}
            >
              {t("notes.calendar.delete")}
            </Button>
          )}
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              color: colors.textSec,
            }}
          >
            {t("notes.calendar.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              fontFamily: fontMain,
              textTransform: "none",
              bgcolor: colors.deepBrown,
              "&:hover": { bgcolor: colors.deepBrown2 },
            }}
          >
            {editingId ? t("notes.calendar.save") : t("notes.calendar.add")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
