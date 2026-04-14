/**
 * PROJECT PHOENIX: TOTAL MASTER LOGIC & ROUTER v2.1
 */

const T774_ROUTER = {
    '62171': 'prospect.html',
    '62168': 'new-scout.html',
    '62214': 'scout-ops.html',
    '57972': 'family-hub.html',
    '62215': 'leader-intel.html',
    'HOME':  'home.html' 
};

window.routeThisPage = function() {
    const urlParams = new URLSearchParams(window.location.search);
    let menuId = urlParams.get('Menu_Item_ID') || urlParams.get('menu_item_id') || urlParams.get('Custom_Form_ID');
    
    const fileName = T774_ROUTER[menuId] || T774_ROUTER['HOME'];
    const githubPath = `https://cdn.jsdelivr.net/gh/stkrueger/t774-assets@main/pages/${fileName}`;

    fetch(githubPath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(html => {
            const root = document.getElementById('mission-control-root');
            if (root) {
                root.innerHTML = html;
                
                // --- ELITE FEATURE TRIGGER ---
                // Now that HTML is in the DOM, we run the "Elite" logic
                initInteractivity();
                runMeetingCalculator();
                initScrollReveal();
                
                console.log(`✅ SPA Engine: Rendered ${fileName}`);
            }
        })
        .catch(err => {
            console.error('❌ Router Error:', err);
        });
};

// --- ELITE LOGIC: MEETING CALCULATOR ---
function runMeetingCalculator() {
    const badge = document.getElementById('nextMeetingBadge');
    const dateDisplay = document.getElementById('nextMeetingDate');
    
    if (!badge && !dateDisplay) return; // Only run if the elements exist

    const now = new Date();
    const nextMonday = new Date();
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    
    const options = { month: 'long', day: 'numeric' };
    const dateString = nextMonday.toLocaleDateString('en-US', options);
    
    if (dateDisplay) dateDisplay.innerText = "Mon, " + dateString + " @ 7PM";
    if (badge) badge.innerText = "Next Briefing: " + dateString;
}

// --- ELITE LOGIC: SCROLL REVEAL ---
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length === 0) return;

    const revealCallback = () => {
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) { el.classList.add("active"); }
        });
    };

    window.addEventListener("scroll", revealCallback);
    revealCallback(); // Run once for top items
}

// --- GLOBAL INTERACTIVITY ---
function initInteractivity() {
    window.toggleTray = function() {
        const tray = document.getElementById('commandTray');
        if (tray) tray.classList.toggle('tray-open');
    };
}

// --- AUTH REDIRECTS ---
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
        window.location.href = isLeader ? 'formCustom.aspx?Menu_Item_ID=62215' : 'formCustom.aspx?Menu_Item_ID=62214';
    }
}

initGlobalNav();
