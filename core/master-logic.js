/**
 * PROJECT PHOENIX: MASTER LOGIC v2.5
 * Supply Depot Integration + Fail-Safe Intel
 */

const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVadFgts618Tmji9qZaVbf5DQWaKWOMlf9wJXvrLzq6O9cgV0R901bIMjtdYEuikq6/exec';

const T774_ROUTER = {
    '62171': 'prospect.html',
    '62168': 'new-scout.html',
    '62214': 'scout-ops.html',
    '57972': 'family-hub.html',
    '62215': 'leader-intel.html',
    '62216': 'supplydepot.html', // NEW: Supply Depot Routing
    'HOME':  'home.html' 
};

/**
 * 1. THE INJECTION ENGINE
 */
window.routeThisPage = function() {
    const urlParams = new URLSearchParams(window.location.search);
    // Support Menu_Item_ID, menu_item_id, and Custom_Form_ID
    let menuId = urlParams.get('Menu_Item_ID') || urlParams.get('menu_item_id') || urlParams.get('Custom_Form_ID');
    
    const fileName = T774_ROUTER[menuId] || T774_ROUTER['HOME'];
    const githubPath = `https://cdn.jsdelivr.net/gh/stkrueger/t774-assets@main/pages/${fileName}`;

    console.log(`🚀 Phoenix Router: Routing ${menuId || 'DEFAULT'} -> ${fileName}`);

    fetch(githubPath)
        .then(response => {
            if (!response.ok) throw new Error('GitHub File Not Found');
            return response.text();
        })
        .then(html => {
            const root = document.getElementById('mission-control-root');
            if (root) {
                root.innerHTML = html;
                
                // EXECUTE ELITE FEATURES
                initInteractivity();
                initScrollReveal(); // Initialize animations immediately
                fetchLiveEvents();   // Fetch data in the background
                
                console.log(`✅ SPA Engine: Rendered ${fileName}`);
            }
        })
        .catch(err => console.error('❌ Router Error:', err));
};

/**
 * 2. THE LIVE INTEL ENGINE (With 3s Timeout)
 */
async function fetchLiveEvents() {
    const badge = document.getElementById('nextMeetingBadge');
    const dateDisplay = document.getElementById('nextMeetingDate');
    if (!badge && !dateDisplay) return;

    // TACTICAL TIMEOUT: Don't let a slow fetch hang the UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
        const response = await fetch(APPSCRIPT_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();

        if (data.error || !Array.isArray(data)) {
            console.warn("⚠️ Intelligence Engine: Rate Limit or Malformed Data.");
            runThursdayFallback();
            return;
        }

        const allowedKeywords = ['troop meeting', 'fundraiser'];
        const blockedKeywords = ['plc', 'leader', 'committee', 'staff', 'board', 'scoutmaster'];

        const match = data.find(event => {
            const title = (event.title || "").toLowerCase();
            const isAllowed = allowedKeywords.some(kw => title.includes(kw));
            const isNotBlocked = !blockedKeywords.some(kw => title.includes(kw));
            return isAllowed && isNotBlocked;
        });

        if (match) {
            const dateStr = `${match.month} ${match.day}`;
            if (dateDisplay) dateDisplay.innerText = `${match.title} - ${dateStr}`;
            if (badge) badge.innerText = `Next Mission: ${dateStr}`;
        } else {
            routerFallback(); // Consolidated fallback check
        }

    } catch (err) {
        console.warn("❌ Intel Link Timeout/Failure. Triggering Fallback Math.");
        runThursdayFallback();
    }
}

/**
 * 3. THE THURSDAY FALLBACK (Calculated)
 */
function runThursdayFallback() {
    const badge = document.getElementById('nextMeetingBadge');
    const dateDisplay = document.getElementById('nextMeetingDate');
    
    const now = new Date();
    const nextThursday = new Date();
    // Distance to Thursday (4)
    const diff = (4 + 7 - now.getDay()) % 7;
    nextThursday.setDate(now.getDate() + (diff === 0 ? 0 : diff));
    
    const options = { month: 'short', day: 'numeric' };
    const dateString = nextThursday.toLocaleDateString('en-US', options);
    
    if (dateDisplay) dateDisplay.innerText = `Troop Meeting - ${dateString} @ 7PM`;
    if (badge) badge.innerText = `Next Briefing: ${dateString}`;
}

/**
 * 4. UI ANIMATIONS (Intersection Observer)
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length === 0) return;

    const observerOptions = { threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Reveal once, then stop watching
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/**
 * 5. TWH INTEGRATION HELPERS
 */
function initInteractivity() {
    window.toggleTray = function() {
        const tray = document.getElementById('commandTray');
        if (tray) tray.classList.toggle('tray-open');
    };
}

function initGlobalNav() {
    let isLoggedIn = false;
    let isLeader = false;
    document.querySelectorAll('a, span, div, li').forEach(el => {
        const text = el.textContent.trim();
        if (text === 'Log Off') isLoggedIn = true;
        if (text === 'Maintain' || text === 'Administration') isLeader = true;
    });

    if (isLoggedIn && !sessionStorage.getItem('t774_redirected')) {
        sessionStorage.setItem('t774_redirected', 'true');
        window.location.href = isLeader ? 'formCustom.aspx?Menu_Item_ID=62215' : 'formCustom.aspx?Menu_Item_ID=62214';
    }
}

// EXECUTION BOOT
initGlobalNav();
window.routeThisPage();
