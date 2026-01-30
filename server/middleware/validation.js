import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // Valida body, query e params combinados
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: err.errors.map(e => `${e.path.join(".")}: ${e.message}`)
      });
    }
    next(err);
  }
};
