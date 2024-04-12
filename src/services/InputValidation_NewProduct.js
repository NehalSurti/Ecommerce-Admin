export function handleInputValidation(name, value) {
  if (name === "title" || name === "desc") {
    // Sanitize title and description by removing HTML tags and trimming white spaces
    value = value.replace(/(<([^>]+)>)/gi, "").trim();
    // Limit length
    value = value.slice(0, 100); // Limit to 100 characters
    return value;
  } else if (name === "price") {
    // Sanitize price by allowing only numbers and dots
    value = value.replace(/[^\d.]/g, "").trim();
    return value;
  } else if (name === "inStock") {
    // Sanitize inStock by converting it to boolean
    return value === "true" ? true : false;
  } else if (name === "categories" || name === "color" || name === "size") {
    if (value !== "") {
      // Sanitize categories, color, and size by splitting and trimming white spaces
      value = value.split(",").map((item) => item.trim());
      // Ensure no duplicates
      value = Array.from(new Set(value));
      return value;
    } else {
      return (value = []);
    }
  }
}

export function handleRequiredFields(inputs, file, cat, color, sizes) {
  const requiredFields = ["title", "desc", "price", "inStock"];
  const isAnyFieldEmpty = requiredFields.some((field) => {
    const value = inputs[field];
    return value === undefined || value === null || value === "";
  });

  if (
    isAnyFieldEmpty ||
    !file ||
    cat.length === 0 ||
    color.length === 0 ||
    sizes.length === 0
  ) {
    return true;
  } else {
    return false;
  }
}

export function handleFileType(file) {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    return true;
  } else {
    return false;
  }
}
