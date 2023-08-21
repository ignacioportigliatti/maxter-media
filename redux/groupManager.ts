// groupManager.js

import { useDispatch } from "react-redux";
import { setGroup } from "./groupSlice";
import { setVideos } from "./videosSlice";
import { setPhotos } from "./photosSlice";
import { setAgency } from "./agencySlice";
import { Agency, Group } from "@prisma/client";

// Extraer cada acción de dispatch en funciones individuales

export const useSelectGroup = () => {
  const dispatch = useDispatch();

  const updateGroup = (selectedGroup: Group) => {
    dispatch(setGroup(selectedGroup));
  };

  const updateVideos = (groupVideos: any) => {
    dispatch(setVideos(groupVideos));
  };

  const updatePhotos = (groupPhotos: any) => {
    dispatch(setPhotos(groupPhotos));
  };

  const updateSelectedAgency = (selectedAgency: Agency) => {
    dispatch(setAgency(selectedAgency));
  };

  return {
    updateGroup,
    updateVideos,
    updatePhotos,
    updateSelectedAgency,
  };
};
