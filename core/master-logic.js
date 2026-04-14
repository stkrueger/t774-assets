/**
 * PROJECT PHOENIX: MASTER LOGIC & ROUTER
 * This is the ONLY file you need to edit to manage page IDs.
 */

// 1. THE GLOBAL ROUTING TABLE
const T774_ROUTER = {
    // 'TWH_MENU_ID': 'GITHUB_FILE_NAME'
    '62171': 'prospect.html',
    '62168': 'new-scout.html',
    '62214': 'scout-ops.html',
    '57972': 'family-hub.html',
    '62215': 'leader-intel.html',
    'HOME':  'home.html' 
};

// 2. THE INJECTION ENGINE
window.routeThisPage = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const menuId = urlParams.get('Menu_Item_ID');
    
    // Determine which file to fetch
    const fileName = T774_ROUTER[menuId] || T774_ROUTER['HOME'];
    const githubPath = `https://raw.githubusercontent.com/stkrueger/t774-assets/main/pages/${fileName}`;

    fetch(githubPath)
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(html => {
            document.getElementById('mission-control-root').innerHTML = html;
            console.log(`✅ SPA Engine: Loaded ${fileName}`);
            
            // Re-trigger any animations or logic needed for the new HTML
            initInteractivity(); 
        })
        .catch(err => console.error('❌ Router Error:', err));
};

// 3. ROLE-BASED REDIRECTS (The Ghost Operator)
function initGlobalNav() {
    let isLoggedIn = false;
    let isLeader = false;
    
    const navElements = document.querySelectorAll('a, span, div, li'); 
    navElements.forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Log Off') isLoggedIn = true;
        if (text === 'Maintain' || text === 'Administration') isLeader = true;
    });

    if (isLoggedIn && !sessionStorage.getItem('t774_redirected')) {
        sessionStorage.setItem('t774_redirected', 'true');
        window.location.href = isLeader 
            ? `formCustom.aspx?Menu_Item_ID=62215` 
            : `formCustom.aspx?Menu_Item_ID=62214`;
    }
}

// 4. UI INTERACTIVITY (Tray Toggle, etc.)
function initInteractivity() {
    window.toggleTray = function() {
        const tray = document.getElementById('commandTray');
        if (tray) tray.classList.toggle('tray-open');
    };
}

// Initial Boot
initGlobalNav();
