export async function imageUrlToBase64(url: string) {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
    reader.onerror = reject;
  });
}

export async function fetchSvgContent(url: string) {
  const response = await fetch(url);
  const svgContent = await response.text();

  const startIndex = svgContent.indexOf("<svg");
  const endIndex = svgContent.lastIndexOf("</svg>") + 6;
  const svgOnly = svgContent.substring(startIndex, endIndex);

  return svgOnly;
}
