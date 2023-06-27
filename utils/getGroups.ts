export const getGroups = async () => {
    try {
      const response = await fetch("/api/groups");
      const data = await response.json();
      return data
    } catch (error) {
      console.log(error);
    }
  };