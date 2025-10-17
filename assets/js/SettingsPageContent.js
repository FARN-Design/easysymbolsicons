document.addEventListener('DOMContentLoaded', function() {
    const removeButtons = document.querySelectorAll('.remove-font');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const fontToRemove = button.getAttribute('data-font');
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = window.location.href;

            const fontInput = document.createElement('input');
            fontInput.type = 'hidden';
            fontInput.name = 'font_to_remove';
            fontInput.value = fontToRemove;
            form.appendChild(fontInput);

            const nonceInput = document.createElement('input');
            nonceInput.type = 'hidden';
            nonceInput.name = 'remove_font_nonce';
            nonceInput.value = EASYICON.remove_nonce;
            form.appendChild(nonceInput);

            document.body.appendChild(form);
            form.submit();
        });
    });

    const popup = document.getElementById('default-fonts-popup');
    if (popup) {
        popup.style.display = 'flex';

        document.getElementById('close-popup').addEventListener('click', () => {
            popup.style.display = 'none';
        });

        document.getElementById('download-default-fonts').addEventListener('click', () => {
            fetch(EASYICON.rest_url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'X-WP-Nonce': EASYICON.rest_nonce,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then(() => {
                alert(EASYICON.success_message);
                window.location.reload();
            })
            .catch(error => {
                alert(EASYICON.error_message);
                console.error(error);
            });
        });
    }

    const iconItems = document.querySelectorAll('.eif-icon-item');

    iconItems.forEach(icon => {
        icon.addEventListener('click', () => {
            const iconName = icon.getAttribute('data-icon-name');
            const shortcode = `[eif-icon icon="${iconName}"]`;

            // Copy to clipboard
            navigator.clipboard.writeText(shortcode).then(() => {
                showTooltip(icon, 'Copied!');
            }).catch(err => {
                console.error('Failed to copy shortcode:', err);
            });
        });
    });

    // Tooltip feedback
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'absolute';
        tooltip.style.background = '#000';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '4px 8px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '9999';
        tooltip.style.pointerEvents = 'none';

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 30}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 30}px`;

        setTimeout(() => {
            tooltip.remove();
        }, 1200);
    }

    const searchInput = document.getElementById('eif-icon-search');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();

        iconItems.forEach(function(item) {
            const iconName = item.getAttribute('data-icon-name').toLowerCase();
            const fontName = item.getAttribute('data-font-name').toLowerCase();

            if (iconName.includes(query) || fontName.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        const fontSections = document.querySelectorAll('.eif-font-section');

        fontSections.forEach(section => {
            const visibleIcons = section.querySelectorAll('.eif-icon-item:not([style*="display: none"])');
            console.log(visibleIcons.length + ' ' + section.getAttribute('data-font-name'));

            if (visibleIcons.length > 0) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });

    const container = document.getElementById('eif-icons-container');
    const navLinks = document.querySelectorAll('#eif-icon-alpha-nav a');

    function onScroll() {
        const containerRect = container.getBoundingClientRect();

        let currentLetter = null;
        for (const link of navLinks) {
            const targetId = link.getAttribute('href').substring(1);
            const targetElem = document.getElementById(targetId);
            if (!targetElem) continue;

            const targetRect = targetElem.getBoundingClientRect();

            // We want to find the letter whose anchor is closest to but not below container top
            if (targetRect.top - containerRect.top <= 10) {
                currentLetter = targetId.replace('alpha-', '');
            } else {
                break; // since anchors are in order, no need to check further
            }
        }

        navLinks.forEach(link => {
            if (link.textContent === currentLetter) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    container.addEventListener('scroll', onScroll);
    onScroll();

});
