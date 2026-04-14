/**
 * PROJECT PHOENIX: MASTER LOGIC
 * Handles Role-Based Routing, Navigation, and Interactivity
 * Location: /core/master-logic.js
 */

// 1. GLOBAL INTERACTIVITY: Command Tray Toggle
// We attach this to 'window' so that the onclick events in your GitHub 
// HTML files can always find it, regardless of scope.
window.toggleTray = function() {
    const tray = document.getElementById('commandTray');
    if (tray) {
        tray.classList.toggle('tray-open');
    } else {
        console.warn('SPA Engine: Command Tray element not found in the current DOM.');
    }
};

// 2. ROLE-BASED NAVIGATION ENGINE
function initGlobalNav() {
    let isLoggedIn = false;
    let isLeader = false;
    
    // Scan for TWH session indicators
    // This looks at the native TWH menu (even if we've hidden it) to determine state
    const navElements = document.querySelectorAll('a, span, div, li'); 
    navElements.forEach(el => {
        const text = el.textContent.trim();
        // 'Log Off' only appears when a user is authenticated
        if (text === 'Log Off') isLoggedIn = true;
        // 'Maintain' or 'Administration' indicates Leader/Admin permissions
        if (text === 'Maintain' || text === 'Administration') isLeader = true;
    });

    // EXECUTE REDIRECT: Only happens once per session login
    if (isLoggedIn && !sessionStorage.getItem('t774_redirected')) {
        sessionStorage.setItem('t774_redirected', 'true');
        
        // Define targets based on your specific TWH Custom Form IDs
        const targetUrl = isLeader 
            ? 'formCustom.aspx?Menu_Item_ID=62215&Stack=0&Custom_Form_ID=12'  // Leader Intel
            : 'formCustom.aspx?Menu_Item_ID=62214&Stack=0&Custom_Form_ID=11'; // Scout Ops
            
        console.log('Project Phoenix: User identified. Redirecting to Tactical Ops...');
        window.location.href = targetUrl;
    }
}

// 3. INITIALIZATION
// This ensures the logic runs as soon as the TWH "Shell" is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalNav);
} else {
    initGlobalNav();
}

// 4. SPA HOOK
// If you ever use a script to swap page content without a reload, 
// call this event to re-verify the environment.
window.addEventListener('spa_page_loaded', function() {
    console.log('Project Phoenix: SPA Content Injected. Re-initializing Tray Listeners...');
});
