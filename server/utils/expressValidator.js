import { validationResult } from 'express-validator';
export const validate = (req, res, next) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    validationErrors = {
      errors: [
        ...new Map(
          validationErrors.array().map((v) => [v['path'], { value: v.value, property: v.path, msg: v.msg }])
        ).values()
      ]
    };
    res.status(422).json(validationErrors);
    return;
  }
  next();
};
