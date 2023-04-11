export const HTMLEncoder = (html) => {
  let virtualFragment = document.createElement("div");
  virtualFragment.innerHTML = html;

  return virtualFragment.textContent || virtualFragment.innerText || "";
};
