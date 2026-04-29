// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all tab links and content sections
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to show a specific tab
    function showTab(targetTab) {
        // Remove active class from all tab links and content
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab link
        const activeLink = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Show the corresponding content
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Update URL hash without scrolling
        history.replaceState(null, null, `#${targetTab}`);
        
        // Update page title
        updatePageTitle(targetTab);
        
        // Update ARIA attributes
        tabLinks.forEach(link => {
            const isActive = link.getAttribute('data-tab') === targetTab;
            link.setAttribute('aria-selected', isActive);
            link.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }

    // Add click event listeners to all tab links
    tabLinks.forEach(link => {
        if (link.classList.contains('cv-link')) return;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            showTab(targetTab);
        });
    });

    // Handle initial page load with hash
    function handleInitialHash() {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash && document.getElementById(hash)) {
            showTab(hash);
        } else {
            // Default to bio tab if no valid hash
            showTab('bio');
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        handleInitialHash();
    });

    // Initialize the correct tab on page load
    handleInitialHash();


    // Add keyboard navigation for tabs
    document.addEventListener('keydown', function(e) {
        // Only handle keyboard navigation when focus is on a tab
        if (document.activeElement.classList.contains('tab-link')) {
            const currentIndex = Array.from(tabLinks).indexOf(document.activeElement);
            let newIndex;

            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = (currentIndex + 1) % tabLinks.length;
                    tabLinks[newIndex].focus();
                    tabLinks[newIndex].click();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = (currentIndex - 1 + tabLinks.length) % tabLinks.length;
                    tabLinks[newIndex].focus();
                    tabLinks[newIndex].click();
                    break;
                case 'Home':
                    e.preventDefault();
                    tabLinks[0].focus();
                    tabLinks[0].click();
                    break;
                case 'End':
                    e.preventDefault();
                    tabLinks[tabLinks.length - 1].focus();
                    tabLinks[tabLinks.length - 1].click();
                    break;
            }
        }
    });

    // Add ARIA attributes for accessibility
    tabLinks.forEach((link, index) => {
        link.setAttribute('role', 'tab');
        link.setAttribute('aria-selected', link.classList.contains('active'));
        link.setAttribute('tabindex', link.classList.contains('active') ? '0' : '-1');
        link.setAttribute('id', `tab-${link.getAttribute('data-tab')}`);
    });

    tabContents.forEach(content => {
        content.setAttribute('role', 'tabpanel');
        const tabId = content.id;
        content.setAttribute('aria-labelledby', `tab-${tabId}`);
    });

});

// Utility function to update the page title based on active tab
function updatePageTitle(tabName) {
    const baseTitle = 'Nitya Nadgir';
    const tabTitles = {
        'bio': 'Bio',
        'publications': 'Publications'
    };
    
    const tabTitle = tabTitles[tabName];
    document.title = tabTitle ? `${tabTitle} | ${baseTitle}` : baseTitle;
}
