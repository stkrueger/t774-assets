/**
 * PROJECT PHOENIX: TOTAL MASTER LOGIC & ROUTER
 * Single Source of Truth for Troop 774 Headless Architecture
 */

// 1. THE GLOBAL ROUTING TABLE
const T774_ROUTER = {
    '62171': 'prospect.html',
    '62168': 'new-scout.html',
    '62214': 'scout-ops.html',
    '57972': 'family-hub.html',
    '62215': 'leader-intel.html',
    'HOME':  'home.html' 
};

// 2. THE INJECTION ENGINE
window.routeThisPage = function() {
    // Robust ID Detection (Checks various TWH URL formats)
    const urlParams = new URLSearchParams(window.location.search);
    let menuId = urlParams.get('Menu_Item_ID') || 
                 urlParams.get('menu_item_id') || 
                 urlParams.get('Custom_Form_ID');
    
    // Determine target file (Falls back to home.html if ID is missing)
    const fileName = T774_ROUTER[menuId] || T774_ROUTER['HOME'];
    
    // Using jsDelivr for professional-grade file delivery
    const githubPath = `https://cdn.jsdelivr.net/gh/stkrueger/t774-assets@main/pages/${fileName}`;

    console.log(`Phoenix Router: Routing ID ${menuId || 'DEFAULT'} to ${fileName}`);

    fetch(githubPath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(html => {
            const root = document.getElementById('mission-control-root');
            if (root) {
                root.innerHTML = html;
                console.log(`✅ SPA Engine: Loaded ${fileName}`);
                
                // Re-bind UI listeners for the new HTML
                initInteractivity();
                
                // Fire custom event for any page-specific JS
                window.dispatchEvent(new Event('spa_page_loaded'));
            }
        })
        .catch(err => {
            console.error('❌ Router Error:', err);
            const root = document.getElementById('mission-control-root');
            if (root) {
                root.innerHTML = '<div style="text-align:center; padding:50px; color:red;">Connection to Mission Control failed. Check GitHub settings.</div>';
            }
        });
};

// 3. ROLE-BASED REDIRECTS (The Ghost Operator)
function initGlobalNav() {
    let isLoggedIn = false;
    let isLeader = false;
    
    // Scan for TWH session status
    const navElements = document.querySelectorAll('a, span, div, li'); 
    navElements.forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Log Off') isLoggedIn = true;
        if (text === 'Maintain' || text === 'Administration') isLeader = true;
    });

    // Execute the Redirect once per session login
    if (isLoggedIn && !sessionStorage.getItem('t774_redirected')) {
        sessionStorage.setItem('t774_redirected', 'true');
        
        const target = isLeader 
            ? 'formCustom.aspx?Menu_Item_ID=62215' 
            : 'formCustom.aspx?Menu_Item_ID=62214';
            
        console.log('Project Phoenix: Authenticated. Redirecting to Tactical Ops...');
        window.location.href = target;
    }
}

// 4. UI INTERACTIVITY (Tray Toggle)
function initInteractivity() {
    window.toggleTray = function() {
        const tray = document.getElementById('commandTray');
        if (tray) {
            tray.classList.toggle('tray-open');
        } else {
            console.warn('SPA Engine: Command Tray not found.');
        }
    };
}

/**
 * INITIALIZATION
 */
// Run the redirect check immediately
initGlobalNav();

// Ensure toggleTray and other UI binds are ready
initInteractivity();
