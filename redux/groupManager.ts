// groupManager.js

import { useDispatch } from "react-redux";
import { setGroup } from "./groupSlice";
import { setVideos } from "./videoSlice";
import { setPhotos } from "./photoSlice";
import { Group } from "@prisma/client";

export const useSelectGroup = () => {
    const dispatch = useDispatch();
  
    // Función para seleccionar un Grupo y actualizar los estados de Videos y Photos
    return (selectedGroup: Group) => {
      dispatch(setGroup(selectedGroup));
      dispatch(setVideos(selectedGroup.videoIds));
      dispatch(setPhotos(selectedGroup.photosIds));
    };
  };