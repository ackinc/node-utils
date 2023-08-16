// variables to replace should be enclosed like this: {{VAR_NAME}}
// whitespace around VAR_NAME is ok
module.exports = (template, data, opts = {}) => {
  let result = template;

  const matches = template.matchAll(/{{(.+?)}}/g);
  for (const match of matches) {
    const placeholder = match[1].trim();

    const val = data[placeholder];
    if (opts.throwIfDataMissing && [null, undefined].includes(val)) {
      throw new Error(`Data missing for placeholder: ${placeholder}`);
    }

    result = result.replace(new RegExp(match[0], "g"), val ?? "");
  }

  return result;
};
