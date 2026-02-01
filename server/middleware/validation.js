export const validate = (schema) => (req, res, next) => {
  try {
    // Normalização básica
    if (req.body.email) req.body.email = req.body.email.toLowerCase().trim();

    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    // Erros de validação i18n friendly (código + path)
    return res.status(400).json({
        error: "Validation Error",
        details: err.errors.map(e => ({ path: e.path, code: e.code, message: e.message }))
    });
  }
};
