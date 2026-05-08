/**
 * PROJECT PHOENIX: MASTER LOGIC v3.3
 * Fail-Safe Global Guard Edition
 */

// 🛑 GLOBAL GUARD: Stop execution if this script is already running
if (!window.T774_LOGIC_ACTIVE) {
    window.T774_LOGIC_ACTIVE = true;

    // Use window properties instead of const to prevent "Already Declared" errors
    window.APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVadFgts618Tmji9qZaVbf5DQWaKWOMlf9wJXvrLzq6O9cgV0R901bIMjtdYEuikq6/exec';

    window.T774_ROUTER = {
        '62171': 'prospect.html',
        '62168': 'new-scout.html',
        '62214': 'scout-ops.html',
        '57972': 'family-hub.html',
        '62215': 'leader-intel.html',
        '62512': 'supplydepot.html', 
        '18':    'supplydepot.html', 
        'HOME':  'home.html' 
    };

    /**
     * 1. THE INJECTION ENGINE
     */
    window.routeThisPage = function() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for specific form tools first
        let menuId = urlParams.get('Custom_Form_ID') || 
                     urlParams.get('Menu_Item_ID') || 
                     urlParams.get('menu_item_id');
        
        const fileName = window.T774_ROUTER[menuId] || window.T774_ROUTER['HOME'];
        const githubPath = `https://cdn.jsdelivr.net/gh/stkrueger/t774-assets@main/pages/${fileName}`;

        console.log(`🚀 Router: [${menuId}] -> [${fileName}]`);

        fetch(githubPath)
            .then(response => {
                if (!response.ok) throw new Error('File Not Found');
                return response.text();
            })
            .then(html => {
                const root = document.getElementById('mission-control-root');
                if (root) {
                    root.innerHTML = html;
                    
                    // Run secondary engines
                    if (typeof initInteractivity === 'function') initInteractivity();
                    if (typeof initScrollReveal === 'function') initScrollReveal();
                    if (typeof fetchLiveEvents === 'function') fetchLiveEvents();
                    
                    console.log(`✅ Rendered: ${fileName}`);
                }
            })
            .catch(err => {
                console.error('❌ Injection Error:', err);
                const root = document.getElementById('mission-control-root');
                if (root) root.innerHTML = '<div style="text-align:center; padding:50px;">Critical Error: Link to GitHub Pages broken.</div>';
            });
    };

    /**
     * 2. THE LIVE INTEL ENGINE
     */
    window.fetchLiveEvents = async function() {
        const badge = document.getElementById('nextMeetingBadge');
        if (!badge) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
            const response = await fetch(window.APPSCRIPT_URL, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await response.json();

            if (!data.error && Array.isArray(data)) {
                const allowed = ['troop meeting', 'fundraiser'];
                const blocked = ['plc', 'leader', 'committee', 'staff', 'board', 'scoutmaster'];

                const match = data.find(event => {
                    const title = (event.title || "").toLowerCase();
                    return allowed.some(kw => title.includes(kw)) && !blocked.some(kw => title.includes(kw));
                });

                if (match) {
                    badge.innerText = `Next Mission: ${match.month} ${match.day}`;
                } else {
                    runThursdayFallback();
                }
            } else {
                runThursdayFallback();
            }
        } catch (err) {
            runThursdayFallback();
        }
    };

    /**
     * 3. HELPERS & BOOT
     */
    window.runThursdayFallback = function() {
        const badge = document.getElementById('nextMeetingBadge');
        if (!badge) return;
        const now = new Date();
        const nextThursday = new Date();
        const diff = (4 + 7 - now.getDay()) % 7;
        nextThursday.setDate(now.getDate() + (diff === 0 ? 0 : diff));
        badge.innerText = `Next Briefing: ${nextThursday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    window.initScrollReveal = function() {
        const reveals = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(el => observer.observe(el));
    };

    window.initInteractivity = function() {
        window.toggleTray = function() {
            const tray = document.getElementById('commandTray');
            if (tray) tray.classList.toggle('tray-open');
        };
    };

    window.initGlobalNav = function() {
        let isLoggedIn = false;
        let isLeader = false;
        const urlParams = new URLSearchParams(window.location.search);
        const isTool = urlParams.get('Custom_Form_ID') || urlParams.get('Menu_Item_ID') === '62512';

        document.querySelectorAll('a, span, div, li').forEach(el => {
            const t = el.textContent.trim();
            if (t === 'Log Off') isLoggedIn = true;
            if (t === 'Maintain' || t === 'Administration') isLeader = true;
        });

        if (isLoggedIn && !isTool && !sessionStorage.getItem('t774_redirected')) {
            sessionStorage.setItem('t774_redirected', 'true');
            window.location.href = isLeader ? 'formCustom.aspx?Menu_Item_ID=62215' : 'formCustom.aspx?Menu_Item_ID=62214';
        }
    };

    // BOOT COMMANDS
    window.initGlobalNav();
    window.routeThisPage();
}
