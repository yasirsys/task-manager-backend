export const parseObject = (object: any) => {
  try {
    return JSON.parse(object);
  } catch (error) {
    return object;
  }
};
