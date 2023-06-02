import convert from "heic-convert";

export const convertToPng = async (file: Buffer) => {
  const convertedFile = await convert({
    buffer: file,
    format: "PNG",
    quality: 1,
  });

  return Buffer.from(convertedFile);
};

