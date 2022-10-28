import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

import CloseIcon from "@mui/icons-material/CloseRounded";
import HiddenIcon from "@mui/icons-material/VisibilityOffRounded";

import { RerollDiceIcon } from "../icons/RerollDiceIcon";

import { GradientOverlay } from "./GradientOverlay";
import { useDiceRollStore } from "../dice/store";
import { useMemo, useState } from "react";
import { DiceResults } from "./DiceResults";

export function DiceRollControls() {
  const roll = useDiceRollStore((state) => state.roll);
  const clearRoll = useDiceRollStore((state) => state.clearRoll);
  const reroll = useDiceRollStore((state) => state.reroll);

  const rollValues = useDiceRollStore((state) => state.rollValues);
  const finishedRolling = useMemo(() => {
    const values = Object.values(rollValues);
    if (values.length === 0) {
      return false;
    } else {
      return values.every((value) => value !== null);
    }
  }, [rollValues]);

  const finishedRollValues = useMemo(() => {
    const values: Record<string, number> = {};
    for (const [id, value] of Object.entries(rollValues)) {
      if (value !== null) {
        values[id] = value;
      }
    }
    return values;
  }, [rollValues]);

  const [resultsExpanded, setResultsExpanded] = useState(false);

  return (
    <>
      <Fade in={finishedRolling} unmountOnExit>
        <GradientOverlay top height={resultsExpanded ? 500 : undefined} />
      </Fade>
      {roll?.hidden && <GradientOverlay />}
      <Fade in={finishedRolling} unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            pointerEvents: "none",
            padding: 3,
          }}
          component="div"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            alignItems="start"
          >
            <Tooltip title="Reroll" sx={{ pointerEvents: "all" }}>
              <IconButton onClick={() => reroll()} disabled={!finishedRolling}>
                <RerollDiceIcon />
              </IconButton>
            </Tooltip>
            {roll && finishedRolling && (
              <DiceResults
                diceRoll={roll}
                rollValues={finishedRollValues}
                expanded={resultsExpanded}
                onExpand={setResultsExpanded}
              />
            )}
            <Tooltip title="Clear" sx={{ pointerEvents: "all" }}>
              <IconButton
                onClick={() => clearRoll()}
                disabled={!finishedRolling}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Fade>
      {roll?.hidden && (
        <Stack
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            pointerEvents: "none",
            padding: 3,
            alignItems: "center",
          }}
        >
          <Tooltip title="Hidden Roll" sx={{ pointerEvents: "all" }}>
            <HiddenIcon />
          </Tooltip>
        </Stack>
      )}
    </>
  );
}
