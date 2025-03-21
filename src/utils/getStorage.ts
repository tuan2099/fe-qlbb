export const getStorage = (name: string) => {
  const data = localStorage.getItem(name);

  return data;
};
