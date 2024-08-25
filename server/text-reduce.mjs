function convertNewLineToBr(text) {
  return text.replace(/\\n/g, "<br>");
}
function convertColorTagsToSpan(text) {
  return text.replace(
    /<color=(#[0-9A-Fa-f]{6,8})>(.*?)<\/color>/g,
    '<span style="color:$1">$2</span>'
  );
}

function reduceText(text) {
  let result = text;
  if(!result) return '~~NOTEXT~~';
  try {
    result = convertNewLineToBr(result);
    result = convertColorTagsToSpan(result);
  } catch (e) {
    console.log(text);
    return result;
  }
  return result;
}

export default reduceText;
