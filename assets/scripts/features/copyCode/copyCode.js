addCopyButtons(navigator.clipboard);

function addCopyButtons(clipboard) {
  document.querySelectorAll("pre > code").forEach(function (codeBlock) {
    var button = document.createElement("a");
    button.className = "copy-code-button";
    button.innerHTML = "<i class='fa-regular fa-copy'></i>";

    button.addEventListener("click", function () {
      clipboard.writeText(codeBlock.innerText);
    });

    var pre = codeBlock.parentNode;
    if (pre.parentNode.classList.contains("highlight")) {
      var highlight = pre.parentNode;
      highlight.parentNode.insertBefore(button, highlight);
    } else {
      pre.parentNode.insertBefore(button, pre);
    }
  });
}
