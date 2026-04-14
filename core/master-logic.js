/**
 * PROJECT PHOENIX: TOTAL MASTER LOGIC (Full Version)
 * Handles Role-Based Routing, Navigation, and Interactivity
 */

// 1. UI INTERACTIVITY
window.toggleTray = function() {
    const tray = document.getElementById('commandTray');
    if (tray) {
        tray.classList.toggle('tray-open');
    } else {
        console.warn('SPA Engine: Command Tray not found.');
    }
};

// 2. ROLE-BASED REDIRECTS
function initGlobalNav() {
    let isLoggedIn = false;
    let isLeader = false;
    
    // Scan TWH native elements for login state
    const navElements = document.querySelectorAll('a, span, div, li'); 
    navElements.forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Log Off') isLoggedIn = true;
        if (text === 'Maintain' || text === 'Administration') isLeader = true;
    });

    // Execute Redirect
    if (isLoggedIn && !sessionStorage.getItem('t774_redirected')) {
        sessionStorage.setItem('t774_redirected', 'true');
        
        // Target IDs for Scout and Leader landing pages
        const scoutTarget = 'formCustom.aspx?Menu_Item_ID=62214&Stack=0&Custom_Form_ID=11';
        const leaderTarget = 'formCustom.aspx?Menu_Item_ID=62215&Stack=0&Custom_Form_ID=12';
        
        window.location.href = isLeader ? leaderTarget : scoutTarget;
    }
}

// 3. BOOT LOADER
// This ensures the logic fires regardless of how fast TWH loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalNav);
} else {
    initGlobalNav();
}

// Ensure toggleTray is active even if the page content is swapped
window.addEventListener('spa_page_loaded', function() {
    console.log('Project Phoenix: Interface Re-initialized.');
});
