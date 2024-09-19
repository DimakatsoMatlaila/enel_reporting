import { styled } from "@mui/material/styles";

export const StatRoot = styled("div", {
    name: "MuiStat", // The component name
    slot: "root", // The slot name
  })(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(0.5),
    letterSpacing: "-0.025em",
    fontWeight: 600,
    fontFamily: "Arial, sans-serif !important"
  }));
  
export const StatValue = styled("div", {
    name: "MuiStat",
    slot: "value",
  })(({ theme }) => ({
    ...theme.typography.h5,
    fontFamily: "Arial, sans-serif !important"
  }));
  
export const StatUnit = styled("div", {
    name: "MuiStat",
    slot: "unit",
  })(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    fontFamily: "Arial, sans-serif !important"
}));
