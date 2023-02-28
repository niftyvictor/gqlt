export const resSuccApi = (res, data) => {
  return res.send({ data });
};

export const resSuccGql = (data: any) => {
  const payload = {
    code: 200,
    success: true,
    ...data,
  };

  return payload;
};
