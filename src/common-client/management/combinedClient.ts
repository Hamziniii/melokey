export function toBlob() {
  if(localStorage == null)
    return ""
  else 
    return JSON.stringify(localStorage)
}

export function fromBlob(input: string) {
  if(input == "")
    return
  else if(localStorage != null) {
    const obj = JSON.parse(input)
    localStorage.setItem("lastDownload", new Date().toISOString())
    Object.keys(obj).forEach(function (k) {
      localStorage.setItem(k, obj[k]);
    });
  }
}