/**
 * PROJECT PHOENIX: MASTER LOGIC
 * Handles Role-Based Routing, Navigation, and Interactivity
 */

function toggleTray() { 
    document.getElementById('commandTray').classList.toggle('tray-open'); 
}

function initGlobalNav() {
    let isLoggedIn = false;
    let isLeader = false;
    
    // Identify User Role via DOM Scraping
    const navElements = document.querySelectorAll('a, span, div, li'); 
    navElements.forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Log Off') isLoggedIn = true;
        if (text === 'Maintain' || text === 'Administration') isLeader = true;
    });

    // Role-Based Redirect Logic
    if (isLoggedIn && !sessionStorage.getItem('t774_redirected')) {
        sessionStorage.setItem('t774_redirected', 'true');
        // IDs: 62215 (Leader Ops), 62214 (Scout Ops)
        window.location.href = isLeader 
            ? 'formCustom.aspx?Menu_Item_ID=62215&Stack=0&Custom_Form_ID=12' 
            : 'formCustom.aspx?Menu_Item_ID=62214&Stack=0&Custom_Form_ID=11';
    }
}

// Initial Run
document.addEventListener('DOMContentLoaded', initGlobalNav);
