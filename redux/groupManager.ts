// groupManager.js

import { useDispatch } from "react-redux";
import { setGroup } from "./groupSlice";
import { setVideos } from "./videoQueueSlice";
import { setPhotos } from "./photosSlice";
import { setAgency } from "./agencySlice";
import { Agency, Group } from "@prisma/client";

export const useSelectGroup = () => {
    const dispatch = useDispatch();
  
    // Función para seleccionar un Grupo y actualizar los estados de Videos y Photos
    return (selectedGroup: Group, groupVideos: any, groupPhotos: any, selectedAgency: Agency) => {
      dispatch(setGroup(selectedGroup));
      dispatch(setVideos(groupVideos));
      dispatch(setPhotos(groupPhotos));
      dispatch(setAgency(selectedAgency))
    };
  };