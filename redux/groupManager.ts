// groupManager.js

import { useDispatch } from "react-redux";
import { setGroup } from "./groupSlice";
import { setVideos } from "./videosSlice";
import { setPhotos } from "./photosSlice";
import { Agency, Group } from "@prisma/client";
import { getGoogleStorageFiles } from "@/utils";
import { setAgency } from "./agencySlice";

export const useSelectGroup = () => {
    const dispatch = useDispatch();
  
    // Función para seleccionar un Grupo y actualizar los estados de Videos y Photos
    return (selectedGroup: Group, groupVideos: any, groupPhotos: any, selectedAgency: any) => {
      dispatch(setGroup(selectedGroup));
      dispatch(setVideos(groupVideos));
      dispatch(setPhotos(groupPhotos));
      dispatch(setAgency(selectedAgency))
    };
  };