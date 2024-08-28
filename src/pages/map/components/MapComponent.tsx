import { Box, Grid } from "@mui/material";
import { players } from "pages/players/types";
import { useState } from "react";
import { cellSize, MainMap, MapCell } from "../types";
import CellItem from "./CellItem";
import PlayerIcon from "./PlayerIcon";
import { mapCellRows, mapCells } from "./utils";

export default function MapComponent() {
  const finishCell = { id: 101, direction: null } as MapCell;
  const startCell = { id: 0, direction: "right" } as MapCell;

  const [closePopups, setClosePopups] = useState(false);

  const map: MainMap = {
    cellRows: mapCellRows,
    cells: mapCells,
    startCell,
    finishCell,
  };

  const handleClick = () => {
    setClosePopups(!closePopups);
  };

  return (
    <Box style={{ overflowX: "auto", minWidth: "1500px" }} onClick={handleClick}>
      <Grid container justifyContent={"center"}>
        {map.cellRows.map((row, index) => (
          <Grid container item key={index} xs="auto">
            {index === 0 && (
              <Grid item borderTop={1} borderRight={1} borderLeft={1}>
                <CellItem cell={finishCell} />
              </Grid>
            )}
            {index === 9 && (
              <Grid item border={1}>
                <CellItem cell={startCell} />
              </Grid>
            )}
            {index > 0 && index < 9 && (
              <Grid
                item
                borderRight={1}
                style={{ borderLeft: "1px solid transparent" }}
                borderTop={index === 1 ? 1 : 0}
              >
                <div style={{ minHeight: cellSize, minWidth: cellSize }} />
              </Grid>
            )}
            {row.map((cell) => (
              <Grid item key={cell.id} borderRight={1} borderTop={1} borderBottom={index === 9 ? 1 : 0}>
                <CellItem cell={cell} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
      <Box minHeight={100} />
      {players.map((player) => (
        <Box key={player.id}>
          <PlayerIcon key={player.id} player={player} closePopup={closePopups} />
        </Box>
      ))}
    </Box>
  );
}
