

// Mobile Menu
function $(selector) { 
	return document.querySelector(selector)
}
//  Elements
var getIcon = $('#menu-icon');
var getCbNav = $('#vl-nav');

getIcon.addEventListener('click', () => {
	getIcon.classList.toggle('is-active');
	getCbNav.classList.toggle('active');
});


// Mega Menu
const Menus = function (menu) {
    // DOM element(s)
    let container = menu.parentElement,
        currentMenuItem,
        i,
        len;

    this.init = function () {
        menuSetup();
        document.addEventListener('click', closeOpenMenu);
    };
    function toggleOnMenuClick(e) {
        const a = e.currentTarget;
        if (currentMenuItem && a !== currentMenuItem) {
            toggleSubmenu(currentMenuItem);
        }

        toggleSubmenu(a);
    }

    function toggleSubmenu(a) {
        const submenu = document.getElementById(
            a.getAttribute('aria-controls')
        );

        if ('true' === a.getAttribute('aria-expanded')) {
            a.setAttribute('aria-expanded', false);
            submenu.setAttribute('aria-hidden', true);
            currentMenuItem = false;
        } else {
            a.setAttribute('aria-expanded', true);
            submenu.setAttribute('aria-hidden', false);
            preventOffScreenSubmenu(submenu);
            currentMenuItem = a;
        }
    }

    function preventOffScreenSubmenu(submenu) {
        const screenWidth =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth,
            parent = submenu.offsetParent,
            menuLeftEdge = parent.getBoundingClientRect().left,
            menuRightEdge = menuLeftEdge + submenu.offsetWidth;

        if (menuRightEdge + 32 > screenWidth) {
            submenu.classList.add('sub-menu--right');
        }
    }

    function closeOnEscKey(e) {
        if (27 === e.keyCode) {
            // we're in a submenu item
            if (null !== e.target.closest('ul[aria-hidden="false"]')) {
                currentMenuItem.focus();
                toggleSubmenu(currentMenuItem);
            } else if ('true' === e.target.getAttribute('aria-expanded')) {
                toggleSubmenu(currentMenuItem);
            }
        }
    }

    function closeOpenMenu(e) {
        if (currentMenuItem && !e.target.closest('#' + container.id)) {
            toggleSubmenu(currentMenuItem);
        }
    }
    function menuSetup() {
        menu.classList.remove('no-js');

        menu.querySelectorAll('ul.cb-mega').forEach((submenu) => {
            const menuItem = submenu.parentElement;

            if ('undefined' !== typeof submenu) {
                let a = convertLinkToa(menuItem);

                setUpAria(submenu, a);

                // bind event listener to a
                a.addEventListener('click', toggleOnMenuClick);
                menu.addEventListener('keyup', closeOnEscKey);
            }
        });
    }
    function convertLinkToa(menuItem) {
        const link = menuItem.getElementsByTagName('a')[0],
            linkHTML = link.innerHTML,
            linkAtts = link.attributes,
            a = document.createElement('a');

        if (null !== link) {
            // copy a attributes and content from link
            a.innerHTML = linkHTML.trim();
            for (i = 0, len = linkAtts.length; i < len; i++) {
                let attr = linkAtts[i];
                if ('href' !== attr.name) {
                    a.setAttribute(attr.name, attr.value);
                }
            }

            menuItem.replaceChild(a, link);
        }

        return a;
    }

    function setUpAria(submenu, a) {
        const submenuId = submenu.getAttribute('id');

        let id;
        if (null === submenuId) {
            id =
                a.textContent.trim().replace(/\s+/g, '-').toLowerCase() +
                '-submenu';
        } else {
            id = menuItemId + '-submenu';
        }
        a.setAttribute('aria-controls', id);
        a.setAttribute('aria-expanded', false);
        submenu.setAttribute('id', id);
        submenu.setAttribute('aria-hidden', true);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const menus = document.querySelectorAll('#menu');

    menus.forEach((menu) => {
        let clickyMenu = new Menus(menu);
        clickyMenu.init();
    });
});
