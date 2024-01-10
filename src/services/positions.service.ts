import axios from "axios";
import { loadAbort } from "../utilities";
import {
  urlGetAllPositions,
  urlCreatePositions,
  urlUpdatePositions,
} from "../constants/urls";
import {
  CREATE_POSITIONS_MODEL,
  UPDATE_POSITIONS_MODEL,
  UPDATE_POSITIONS_STATE_MODEL,
} from "../models/positions.model";

export const getAllPositions = () => {
  const controller = loadAbort();
  return {
    call: axios.get(urlGetAllPositions, { signal: controller.signal }),
    controller,
  };
};
export const createPosition = (body: CREATE_POSITIONS_MODEL) => {
  const controller = loadAbort();
  return {
    call: axios.post(urlCreatePositions, body, { signal: controller.signal }),
    controller,
  };
};
export const updatePositions = (
  positionSelected: any,
  body: UPDATE_POSITIONS_MODEL
) => {
  const controller = loadAbort();
  return {
    call: axios.patch(
      `${urlUpdatePositions}/${positionSelected ? positionSelected.id : 0}`,
      body,
      { signal: controller.signal }
    ),
    controller,
  };
};

export const updatePositionsState = (
  positionSelected: any,
  body: UPDATE_POSITIONS_STATE_MODEL
) => {
  const controller = loadAbort();
  return {
    call: axios.patch(
      `${urlUpdatePositions}/${positionSelected ? positionSelected.id : 0}`,
      body,
      { signal: controller.signal }
    ),
    controller,
  };
};
