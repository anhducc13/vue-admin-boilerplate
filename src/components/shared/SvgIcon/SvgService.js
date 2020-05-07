import axios from "axios";

const library = new Map();
const ongoingReqs = new Map();

const get = url => {
  let p;
  if (library.has(url)) {
    p = Promise.resolve(library.get(url));
  } else if (ongoingReqs.has(url)) {
    p = ongoingReqs.get(url);
  } else {
    p = downloadSvg(url);
    ongoingReqs.set(url, p);
  }
  return p;
};

const downloadSvg = url => {
  return axios.get(url, { responseType: "text" }).then(responseText => {
    const id = getId(url);
    const metadata = add(id, responseText.data);
    library.set(url, metadata);
    ongoingReqs.delete(url);
    return metadata;
  });
};

const add = (id, svgContent) => {
  const svgTemplateMetadata = createSvgTemplate(id, svgContent);
  document.body.insertBefore(
    svgTemplateMetadata.elt,
    document.body.childNodes[0]
  );
  delete svgTemplateMetadata.elt;
  return svgTemplateMetadata;
};

const createSvgTemplate = (id, svgContent) => {
  const div = document.createElement("div");
  div.innerHTML = svgContent;
  const svg = div.querySelector("svg");
  const templateElt = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  templateElt.setAttribute("id", id);
  while (svg.childNodes.length > 0) {
    templateElt.appendChild(svg.childNodes[0]);
  }
  return {
    id: id,
    elt: templateElt,
    viewBox: svg.getAttribute("viewBox"),
    width: parseInt(svg.getAttribute("width"), 10),
    height: parseInt(svg.getAttribute("height"), 10)
  };
};

const getId = url => {
  return url.replace(/.+\/(.+).svg/, "$1") + new Date().getTime();
};

export { get };
