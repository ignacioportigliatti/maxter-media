import { Group } from "@prisma/client";
import axios from "axios";

export const getGroupCodes = async (group: Group) => {

    try {
      const res = await axios
        .post("/api/codes/get", {
          groupId: group.id,
        })
        .then((res) => res.data);

      if (res.success) {
        // Ordenar los códigos según la configuración actual
        
        return res.codes
      }
    } catch (error) {
      console.error(error);
    }
  };