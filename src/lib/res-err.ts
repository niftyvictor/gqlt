export const resErrApi = (res, e) => {
  console.error(e);

  const payload = { name: null, message: null, code: null };
  if (e.name) payload.name = e.name;
  if (e.message) payload.message = e.message;
  if (e.code) payload.code = e.code;

  return res.status(400).send({ error: payload });
};

export const resErrGql = (e) => {
  console.error(e);

  const payload = { code: 400, message: null, success: false };
  if (e.message) payload.message = e.message;

  return payload;
};
