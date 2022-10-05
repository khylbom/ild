import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

type CircularLoadingProps = {
  children?: React.ReactNode;
};

const DisabledBackground = styled(Box)({
  width: "100%",
  height: "100%",
  position: "fixed",
  background: "#ccc",
  opacity: 0.5,
  zIndex: 1
});

const CircularLoading: React.FC<CircularLoadingProps> = ({ children }) => {
  return (
    <React.Fragment>
      <CircularProgress
        sx={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 2
        }}
      />
      {children}
      <DisabledBackground />
    </React.Fragment>
  );
};

export default CircularLoading;
