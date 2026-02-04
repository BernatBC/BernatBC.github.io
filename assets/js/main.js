document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile Navigation Toggle (Common)
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarNav = document.getElementById('navbar-nav');
    
    if (navbarToggle && navbarNav) {
        navbarToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('show');
        });
    }

    // 2. Index Page: Active Links & Smooth Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        function highlightNavLink() {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if(link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', highlightNavLink);
        highlightNavLink(); // Call once on load
        
        navLinks.forEach(link => {
            if(link.hash) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const offset = targetId === 'profile' ? 120 : 80;
                        const targetPosition = targetSection.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, null, this.getAttribute('href'));
                    }
                    
                    if (navbarNav && navbarNav.classList.contains('show')) {
                        navbarNav.classList.remove('show');
                    }
                });
            }
        });
    }

    // 3. Single Page: Code Copy Buttons
    const codeBlocks = document.querySelectorAll('pre > code');
    if (codeBlocks.length > 0) {
        codeBlocks.forEach(function(codeBlock) {
             const button = document.createElement('button');
             button.className = 'copy-code-button';
             button.type = 'button';
             button.innerHTML = '<i class="fas fa-copy"></i> Copy';

             const pre = codeBlock.parentNode;
             if (pre.parentNode) {
                 const wrapper = document.createElement('div');
                 wrapper.className = 'code-block-wrapper';
                 
                 const codeClass = codeBlock.className;
                 if (codeClass && codeClass.startsWith('language-')) {
                     const lang = codeClass.replace('language-', '');
                     wrapper.setAttribute('data-lang', lang);
                 }
                 
                 pre.parentNode.insertBefore(wrapper, pre);
                 wrapper.appendChild(pre);
                 wrapper.appendChild(button);
                 
                 button.addEventListener('click', function() {
                     navigator.clipboard.writeText(codeBlock.textContent).then(
                         function() {
                             button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                             setTimeout(function() {
                                 button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                             }, 2000);
                         },
                         function() {
                             button.innerHTML = '<i class="fas fa-times"></i> Error';
                             setTimeout(function() {
                                 button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                             }, 2000);
                         }
                     );
                 });
             }
        });
    }

    // 4. Single Page: TOC Generation
    const postContent = document.querySelector('.post-content');
    const tocContent = document.getElementById('toc-content');
    
    if (postContent && tocContent) {
        const headings = postContent.querySelectorAll('h2, h3, h4');
        
        if (headings.length > 0) {
            const toc = document.createElement('ul');
            
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = 'heading-' + index;
                }
                
                const listItem = document.createElement('li');
                listItem.className = 'toc-' + heading.tagName.toLowerCase();
                
                const link = document.createElement('a');
                link.href = '#' + heading.id;
                link.textContent = heading.textContent;
                
                listItem.appendChild(link);
                toc.appendChild(listItem);
                
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById(heading.id).scrollIntoView({
                        behavior: 'smooth'
                    });
                     history.pushState(null, null, '#' + heading.id);
                });
            });
            
            tocContent.appendChild(toc);
        } else {
             const container = document.querySelector('.toc-container');
             if(container) container.style.display = 'none';
        }
    }

    // 5. Single Page: TOC Active Link
    const tocLinks = document.querySelectorAll('.toc-content a');
    if (tocLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let currentActiveLink = null;
            const scrollPosition = window.scrollY;
            
            document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4').forEach(heading => {
                const headingTop = heading.offsetTop;
                if (headingTop - 100 <= scrollPosition) {
                    currentActiveLink = document.querySelector(`.toc-content a[href="#${heading.id}"]`);
                }
            });
            
            tocLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            if (currentActiveLink) {
                currentActiveLink.classList.add('active');
            }
        });
    }

    // 6. KaTeX Auto-Render
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body);
    }
});