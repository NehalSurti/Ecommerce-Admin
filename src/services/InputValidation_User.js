export function handleRequiredFields(inputs, image, street, country, postcode) {
  const requiredFields = [
    "username",
    "fullName",
    "email",
    "phone",
    "status",
    "isAdmin",
  ];
  const isAnyFieldEmpty = requiredFields.some((field) => {
    const value = inputs[field];
    return value === undefined || value === null || value === "";
  });

  const isImgFieldEmpty = image === undefined || image === null || image === "";
  const isStreetFieldEmpty =
    street === undefined || street === null || street === "";
  const isCountryFieldEmpty =
    country === undefined || country === null || country === "";
  const isPostcodeFieldEmpty =
    postcode === undefined || postcode === null || postcode === "";

  if (
    isAnyFieldEmpty ||
    isImgFieldEmpty ||
    isStreetFieldEmpty ||
    isCountryFieldEmpty ||
    isPostcodeFieldEmpty
  ) {
    return true;
  } else {
    return false;
  }
}

export function handleFileType(file) {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return true;
  } else {
    return false;
  }
}

export function handleValidation(inputs) {
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function validateMobileNumber(mobile) {
    const regex = /^(\+\d{1,3}\s?)?(\d{10})$/;
    return regex.test(mobile);
  }

  function isValidName(name) {
    const regex = /^[A-Za-z]+\s?[A-Za-z]+$/;
    return regex.test(name);
  }

  if (!isValidName(inputs.fullName)) {
    return { check: false, toastMsg: "Full Name can only contain letters" };
  } else if (!isValidEmail(inputs.email)) {
    return { check: false, toastMsg: "Enter a valid Email" };
  } else if (!validateMobileNumber(inputs.phone)) {
    return { check: false, toastMsg: "Enter a valid Mobile No." };
  }
  return { check: true };
}
