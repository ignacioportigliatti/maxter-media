export const getGroups = async () => {
    try {
      const response = await fetch("/api/groups");
      const data = await response.json();
      return data
    } catch (error) {
      console.log(error);
    }
  };

export const getAgencies = async () => {
    try {
      const response = await fetch("/api/agencies");
      const data = await response.json();
      return data
    } catch (error) {
      console.log(error);
    }
  }