document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('pre > code').forEach(function(codeBlock) {
        const pre = codeBlock.parentNode;
        if (!pre.parentNode) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        const button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.textContent = 'Copy code';
        wrapper.appendChild(button);
        button.addEventListener('click', function() {
            if (!navigator.clipboard) {
                button.textContent = 'Copy unavailable';
                return;
            }
            navigator.clipboard.writeText(codeBlock.textContent).then(
                function() { button.textContent = 'Copied!'; },
                function(error) {
                    console.error('Unable to copy code:', error);
                    button.textContent = 'Copy failed';
                }
            );
        });
    });

    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.querySelector('.post-content'));
    }
});
