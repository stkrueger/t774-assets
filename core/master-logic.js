/**
 * PROJECT PHOENIX: TOTAL MASTER LOGIC & ROUTER v2.3
 * Optimized for Google Apps Script v4.26 (ICAL Engine)
 */

// CONFIGURATION: Replace with your actual AppScript Web App URL
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVadFgts618Tmji9qZaVbf5DQWaKWOMlf9wJXvrLzq6O9cgV0R901bIMjtdYEuikq6/exec';

const T774_ROUTER = {
    '62171': 'prospect.html',
    '62168': 'new-scout.html',
    '62214': 'scout-ops.html',
    '57972': 'family-hub.html',
    '62215': 'leader-intel.html',
    'HOME':  'home.html' 
};

/**
 * 1. THE INJECTION ENGINE
 */
window.routeThisPage = function() {
    const urlParams = new URLSearchParams(window.location.search);
    let menuId = urlParams.get('Menu_Item_ID') || urlParams.get('menu_item_id') || urlParams.get('Custom_Form_ID');
    
    const fileName = T774_ROUTER[menuId] || T774_ROUTER['HOME'];
    const githubPath = `https://cdn.jsdelivr.net/gh/stkrueger/t774-assets@main/pages/${fileName}`;

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
                fetchLiveEvents(); 
                initScrollReveal();
                
                console.log(`✅ SPA Engine: Rendered ${fileName}`);
            }
        })
        .catch(err => console.error('❌ Router Error:', err));
};

/**
 * 2. THE LIVE INTEL ENGINE (Mapped to AppScript v4.26)
 */
async function fetchLiveEvents() {
    const badge = document.getElementById('nextMeetingBadge');
    const dateDisplay = document.getElementById('nextMeetingDate');
    if (!badge && !dateDisplay) return;

    try {
        const response = await fetch(APPSCRIPT_URL);
        const data = await response.json();

        // NEW: Specific Error Recognition
        if (data.error) {
            console.warn(`⚠️ Intelligence Engine: ${data.error}`);
            // If we're being rate limited, we immediately trigger the fallback math
            runThursdayFallback();
            return; 
        }

        // Ensure the data is an array before trying to search it
        if (!Array.isArray(data)) {
            throw new Error("Invalid Intel Format");
        }

        const allowedKeywords = ['troop meeting', 'fundraiser'];
        const blockedKeywords = ['plc', 'leader', 'committee', 'staff', 'board', 'scoutmaster'];

        const nextPublicMission = data.find(event => {
            const title = (event.title || "").toLowerCase();
            const isAllowed = allowedKeywords.some(kw => title.includes(kw));
            const isNotBlocked = !blockedKeywords.some(kw => title.includes(kw));
            return isAllowed && isNotBlocked;
        });

        if (nextPublicMission) {
            const dateStr = `${nextPublicMission.month} ${nextPublicMission.day}`;
            if (dateDisplay) dateDisplay.innerText = `${nextPublicMission.title} - ${dateStr}`;
            if (badge) badge.innerText = `Next Mission: ${dateStr}`;
        } else {
            runThursdayFallback();
        }

    } catch (err) {
        // This is the "Safety Net" catch-all
        console.error("❌ Intel Link Failure:", err.message);
        runThursdayFallback();
    }
}

/**
 * 3. THE THURSDAY FALLBACK (If Sheet is empty or offline)
 */
function runThursdayFallback() {
    const badge = document.getElementById('nextMeetingBadge');
    const dateDisplay = document.getElementById('nextMeetingDate');
    
    const now = new Date();
    const nextThursday = new Date();
    // Calculate distance to Thursday (4)
    const diff = (4 + 7 - now.getDay()) % 7;
    nextThursday.setDate(now.getDate() + (diff === 0 ? 0 : diff));
    
    const options = { month: 'short', day: 'numeric' };
    const dateString = nextThursday.toLocaleDateString('en-US', options);
    
    if (dateDisplay) dateDisplay.innerText = `Troop Meeting - ${dateString} @ 7PM`;
    if (badge) badge.innerText = `Next Briefing: ${dateString}`;
}

/**
 * 4. UI & AUTH HELPERS
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length === 0) return;
    const revealCallback = () => {
        reveals.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add("active");
        });
    };
    window.addEventListener("scroll", revealCallback);
    revealCallback();
}

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

// Boot the redirect check
initGlobalNav();
