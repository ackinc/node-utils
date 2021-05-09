module.exports = (mobileNumber, formatString = "+CASR") => {
  const digits = mobileNumber.toString().replace(/\D/g, "");
  if (digits.length <= 10) throw new Error("Invalid mobileNumber");

  const countryCode = digits.substr(0, digits.length - 10);
  const areaCode = digits.substr(countryCode.length, 3);
  const subscriberNumber = digits.substr(
    countryCode.length + areaCode.length,
    3
  );
  const rest = digits.substr(
    countryCode.length + areaCode.length + subscriberNumber.length
  );

  return formatString
    .replace(/C/g, countryCode)
    .replace(/A/g, areaCode)
    .replace(/S/g, subscriberNumber)
    .replace(/R/g, rest);
};
