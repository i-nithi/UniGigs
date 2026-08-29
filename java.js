/* ==========================================================================
   UniGigs - Single Page Application Engine & LocalStorage Manager
   ========================================================================== */

(function () {
    'use strict';

    // 1. DEFAULT MOCK DATA SEED
    const SEED_USERS = [
        {
            id: 'usr_1',
            name: 'Nithyashri R',
            email: 'regno@sastra.ac.in',
            password: 'password123',
            dept: 'School of Computing, SASTRA',
            year: '3rd Year (Junior)',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Undergrad student at SASTRA Deemed University, Thanjavur. Passionate about software engineering, UI design, academic help, and campus activities.',
            skills: ['Python & C++', 'Fast Delivery', 'Linear Algebra', 'Web Development'],
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            walletBalance: 1200,
            pendingEscrow: 650,
            totalEarned: 4250,
            rating: 4.9,
            reviewCount: 18,
            completedGigsCount: 14,
            upiId: 'nithyashri@upi',
            isVerified: true
        },
        {
            id: 'usr_2',
            name: 'Ananya Sen',
            email: 'ananya.math23@sastra.ac.in',
            password: 'password123',
            dept: 'Mathematics & Computing',
            year: '2nd Year',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Math enthusiast at SASTRA. Love solving calculus problems, tutoring for mid-terms, and managing event logistics.',
            skills: ['Calculus & Algebra', 'Event Management', 'LaTeX Formatting'],
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
            walletBalance: 850,
            pendingEscrow: 450,
            totalEarned: 3100,
            rating: 4.9,
            reviewCount: 12,
            completedGigsCount: 9,
            upiId: 'ananya@upi',
            isVerified: true
        },
        {
            id: 'usr_3',
            name: 'Vikram Verma',
            email: 'vikram.ee21@sastra.ac.in',
            password: 'password123',
            dept: 'Electrical Engineering',
            year: '4th Year',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Robotics enthusiast and tech troubleshooter. I help with hardware debugging, microcontrollers, and campus food pickups.',
            skills: ['Arduino & Hardware', 'Tech Repair', 'Quick Delivery'],
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            walletBalance: 400,
            pendingEscrow: 0,
            totalEarned: 5200,
            rating: 4.8,
            reviewCount: 22,
            completedGigsCount: 17,
            upiId: 'vikram@upi',
            isVerified: true
        },
        {
            id: 'usr_4',
            name: 'Sneha Patel',
            email: 'sneha.mech24@sastra.ac.in',
            password: 'password123',
            dept: 'Mechanical Engineering',
            year: '1st Year',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Freshman student ready to help with library errands, printout pickups, and hostel deliveries.',
            skills: ['Campus Errands', 'Fast Runner', 'Note Taking'],
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
            walletBalance: 150,
            pendingEscrow: 0,
            totalEarned: 1800,
            rating: 5.0,
            reviewCount: 6,
            completedGigsCount: 5,
            upiId: 'sneha@upi',
            isVerified: true
        }
    ];

    const SEED_GIGS = [
        {
            id: 'gig_1',
            title: 'Print & Spiral Bind 60-Page Machine Learning Lab Manual',
            category: 'Printing',
            description: 'Need someone to download PDF from Drive, print 60 double-sided pages in color, spiral bind it with a clear front cover, and drop it at Central Library desk.',
            reward: 220,
            location: 'Central Library & Reading Hall',
            deadline: '2026-08-30T15:00',
            postedBy: 'usr_1',
            assignedWorker: null,
            status: 'available', // available, accepted, in_progress, submitted, completed, cancelled
            submissionDetails: null,
            requirements: ['Access to high quality printer', 'Must finish before 3 PM'],
            createdAt: '2026-08-29T10:00:00Z',
            savedBy: ['usr_1']
        },
        {
            id: 'gig_2',
            title: 'Late Night Midnight Biryani & Chai Delivery to Hostel 4',
            category: 'Food',
            description: 'Pick up 2 plates of chicken biryani + 2 cups of hot masala chai from Canteen 2 near Main Gate and deliver to Hostel 4 Room 302.',
            reward: 180,
            location: 'Hostel 4 / Block B',
            deadline: '2026-08-29T23:30',
            postedBy: 'usr_3',
            assignedWorker: 'usr_1',
            status: 'in_progress',
            submissionDetails: null,
            requirements: ['Has bicycle/scooter preferred', 'Hot delivery'],
            createdAt: '2026-08-29T21:00:00Z',
            savedBy: []
        },
        {
            id: 'gig_3',
            title: 'Linear Algebra & Matrix Quiz Prep Tutoring (2 Hours)',
            category: 'Academic Help',
            description: 'Looking for an A-grade student to explain Eigenvalues, Singular Value Decomposition (SVD), and Vector spaces before tomorrow mid-term quiz.',
            reward: 500,
            location: 'Tech Park & Computer Labs',
            deadline: '2026-08-30T18:00',
            postedBy: 'usr_1',
            assignedWorker: 'usr_2',
            status: 'submitted',
            submissionDetails: {
                notes: 'Completed 2.5 hour tutoring session in CS Lab 3. Covered SVD formulas and practice problem sheet.',
                link: 'https://drive.google.com/file/d/math_notes_sample'
            },
            requirements: ['Strong math grade', 'Patient tutor'],
            createdAt: '2026-08-28T14:00:00Z',
            savedBy: ['usr_2']
        },
        {
            id: 'gig_4',
            title: 'Hold Front-Row Seat at Main Auditorium for Tech Fest Keynote',
            category: 'Errands',
            description: 'Need someone to reach Auditorium 30 minutes early (at 4:30 PM) and save two seats in row B for the guest lecture.',
            reward: 250,
            location: 'Sports Complex & Gymnasium',
            deadline: '2026-08-30T16:30',
            postedBy: 'usr_2',
            assignedWorker: null,
            status: 'available',
            submissionDetails: null,
            requirements: ['Punctual student'],
            createdAt: '2026-08-29T11:20:00Z',
            savedBy: []
        },
        {
            id: 'gig_5',
            title: 'DSLR Event Photography for IEEE Student Chapter Seminar',
            category: 'Events',
            description: 'Capture high-res photos during 2-hour evening seminar at Science Block A. Raw files delivered via Google Drive.',
            reward: 850,
            location: 'Science Block A',
            deadline: '2026-08-31T20:00',
            postedBy: 'usr_4',
            assignedWorker: null,
            status: 'available',
            submissionDetails: null,
            requirements: ['Own DSLR/Mirrorless camera', 'Basic Lightroom editing'],
            createdAt: '2026-08-29T12:00:00Z',
            savedBy: ['usr_1']
        },
        {
            id: 'gig_6',
            title: 'Debug React Native Gradle Build Error on M2 Mac',
            category: 'Technical Help',
            description: 'Getting persistent Java home path and Gradle sync failed error while running android emulator. Need experienced dev for quick 30-min pair debugging.',
            reward: 450,
            location: 'Tech Park & Computer Labs',
            deadline: '2026-08-30T12:00',
            postedBy: 'usr_3',
            assignedWorker: null,
            status: 'available',
            submissionDetails: null,
            requirements: ['Mac OS & Android Studio experience'],
            createdAt: '2026-08-29T09:15:00Z',
            savedBy: []
        },
        {
            id: 'gig_7',
            title: 'Pick Up Amazon Courier Parcel from Main Campus Gate',
            category: 'Delivery',
            description: 'I am stuck in back-to-back lectures. Collect heavy box parcel from Security Desk at Main Gate and bring to Hostel 2 reception.',
            reward: 120,
            location: 'Main Gate / Off-Campus Delivery',
            deadline: '2026-08-30T17:00',
            postedBy: 'usr_2',
            assignedWorker: null,
            status: 'available',
            submissionDetails: null,
            requirements: ['ID card for security gate entry'],
            createdAt: '2026-08-29T13:45:00Z',
            savedBy: []
        },
        {
            id: 'gig_8',
            title: 'Assemble & Move IKEA Study Table to Hostel 3 Room 204',
            category: 'Other',
            description: 'Help disassemble wooden study desk in Hostel 4 and carry it up 2 flights of stairs to Hostel 3 room.',
            reward: 300,
            location: 'Hostel 4 / Block B',
            deadline: '2026-08-27T19:00',
            postedBy: 'usr_2',
            assignedWorker: 'usr_1',
            status: 'completed',
            submissionDetails: {
                notes: 'Assembled study table cleanly in room 204. Checked desk stability.'
            },
            requirements: ['Physical lifting'],
            createdAt: '2026-08-26T10:00:00Z',
            savedBy: []
        }
    ];

    const SEED_MESSAGES = [
        {
            id: 'msg_1',
            convoId: 'convo_1',
            gigId: 'gig_2',
            senderId: 'usr_3',
            receiverId: 'usr_1',
            text: 'Hey Nithyashri! Did you manage to get the biryani from Canteen 2?',
            timestamp: '2026-08-29T21:10:00Z',
            isRead: true
        },
        {
            id: 'msg_2',
            convoId: 'convo_1',
            gigId: 'gig_2',
            senderId: 'usr_1',
            receiverId: 'usr_3',
            text: 'Yes Vikram! Just picked up hot biryani and chai. Reaching Hostel 4 in 5 minutes!',
            timestamp: '2026-08-29T21:12:00Z',
            isRead: true
        }
    ];

    const SEED_NOTIFICATIONS = [
        {
            id: 'notif_1',
            userId: 'usr_1',
            type: 'gig',
            title: 'Work Submitted for Review',
            message: 'Ananya Sen submitted work proof for "Linear Algebra Tutoring". Please review and confirm completion.',
            timestamp: '15 mins ago',
            isRead: false,
            link: 'my-gigs'
        },
        {
            id: 'notif_2',
            userId: 'usr_1',
            type: 'payment',
            title: 'Escrow Payout Received ₹300',
            message: 'Payout of ₹300 released to your wallet for completing "Assemble & Move IKEA Study Table".',
            timestamp: '2 hours ago',
            isRead: true,
            link: 'payments'
        },
        {
            id: 'notif_3',
            userId: 'usr_1',
            type: 'message',
            title: 'New message from Vikram Verma',
            message: 'Reaching Hostel 4 in 5 minutes!',
            timestamp: '1 hour ago',
            isRead: false,
            link: 'messages'
        }
    ];

    const SEED_TRANSACTIONS = [
        { id: 'TXN-9021', date: '29 Aug 2026, 09:30 PM', desc: 'Escrow Reserve for Midnight Biryani', type: 'Escrow Hold', amount: -180, status: 'Locked in Escrow' },
        { id: 'TXN-8814', date: '28 Aug 2026, 04:15 PM', desc: 'Earnings for IKEA Desk Assembly', type: 'Earnings', amount: 300, status: 'Completed' },
        { id: 'TXN-7610', date: '27 Aug 2026, 11:00 AM', desc: 'UPI Deposit via GPay', type: 'Deposits', amount: 1000, status: 'Completed' }
    ];

    const SEED_REVIEWS = [
        {
            id: 'rev_1',
            targetUserId: 'usr_1',
            reviewerName: 'Ananya Sen',
            reviewerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            date: '28 Aug 2026',
            text: 'Nithyashri was extremely punctual and handled moving the heavy study table carefully. Highly recommended worker!'
        },
        {
            id: 'rev_2',
            targetUserId: 'usr_1',
            reviewerName: 'Sneha Patel',
            reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            date: '25 Aug 2026',
            text: 'Helped debug my Python assignment in less than 20 minutes. Explained every line clearly.'
        }
    ];

    // 2. STATE MANAGER
    let state = {
        currentUser: null,
        users: [],
        gigs: [],
        messages: [],
        notifications: [],
        transactions: [],
        reviews: [],
        currentView: 'dashboard',
        selectedCategory: 'all',
        searchQuery: '',
        sortBy: 'newest',
        rewardRangeMax: 2000,
        locationFilter: 'all',
        statusFilter: 'available',
        activeConvoId: 'convo_1',
        activeMyGigsTab: 'posted',
        activeProfileTab: 'overview',
        savedGigIds: []
    };

    // 3. PERSISTENCE LAYER
    function loadState() {
        const storedUsers = localStorage.getItem('unigigs_users');
        const storedGigs = localStorage.getItem('unigigs_gigs');
        const storedMsgs = localStorage.getItem('unigigs_messages');
        const storedNotifs = localStorage.getItem('unigigs_notifications');
        const storedTxns = localStorage.getItem('unigigs_transactions');
        const storedReviews = localStorage.getItem('unigigs_reviews');
        const storedCurrUser = localStorage.getItem('unigigs_currentUser');

        if (!storedUsers || !storedGigs) {
            // Seed initial data
            localStorage.setItem('unigigs_users', JSON.stringify(SEED_USERS));
            localStorage.setItem('unigigs_gigs', JSON.stringify(SEED_GIGS));
            localStorage.setItem('unigigs_messages', JSON.stringify(SEED_MESSAGES));
            localStorage.setItem('unigigs_notifications', JSON.stringify(SEED_NOTIFICATIONS));
            localStorage.setItem('unigigs_transactions', JSON.stringify(SEED_TRANSACTIONS));
            localStorage.setItem('unigigs_reviews', JSON.stringify(SEED_REVIEWS));
            localStorage.setItem('unigigs_currentUser', JSON.stringify(SEED_USERS[0]));

            state.users = SEED_USERS;
            state.gigs = SEED_GIGS;
            state.messages = SEED_MESSAGES;
            state.notifications = SEED_NOTIFICATIONS;
            state.transactions = SEED_TRANSACTIONS;
            state.reviews = SEED_REVIEWS;
            state.currentUser = SEED_USERS[0];
        } else {
            state.users = JSON.parse(storedUsers);
            state.gigs = JSON.parse(storedGigs);
            state.messages = JSON.parse(storedMsgs || '[]');
            state.notifications = JSON.parse(storedNotifs || '[]');
            state.transactions = JSON.parse(storedTxns || '[]');
            state.reviews = JSON.parse(storedReviews || '[]');
            state.currentUser = storedCurrUser ? JSON.parse(storedCurrUser) : state.users[0];
        }

        // Auto-migrate cached state to SASTRA University & Nithyashri R
        if (state.currentUser && (state.currentUser.id === 'usr_1' || state.currentUser.name === 'Rahul Sharma' || (state.currentUser.email && state.currentUser.email.includes('iitd.ac.in')))) {
            state.currentUser.name = 'Nithyashri R';
            state.currentUser.email = 'regno@sastra.ac.in';
            state.currentUser.campus = 'SASTRA Deemed University, Thanjavur';
            state.currentUser.dept = 'School of Computing, SASTRA';
            state.currentUser.upiId = 'nithyashri@upi';
            state.currentUser.bio = 'Undergrad student at SASTRA Deemed University, Thanjavur. Passionate about software engineering, UI design, academic help, and campus activities.';
        }
        if (state.users && state.users.length > 0) {
            state.users.forEach(u => {
                u.campus = 'SASTRA Deemed University, Thanjavur';
                if (u.id === 'usr_1') {
                    u.name = 'Nithyashri R';
                    u.email = 'regno@sastra.ac.in';
                    u.dept = 'School of Computing, SASTRA';
                    u.upiId = 'nithyashri@upi';
                } else if (u.email && u.email.includes('@iitd.ac.in')) {
                    u.email = u.email.replace('@iitd.ac.in', '@sastra.ac.in');
                }
            });
        }
        saveState();

        // Initialize saved gigs
        state.savedGigIds = state.gigs.filter(g => g.savedBy && g.savedBy.includes(state.currentUser?.id)).map(g => g.id);
    }

    function saveState() {
        localStorage.setItem('unigigs_users', JSON.stringify(state.users));
        localStorage.setItem('unigigs_gigs', JSON.stringify(state.gigs));
        localStorage.setItem('unigigs_messages', JSON.stringify(state.messages));
        localStorage.setItem('unigigs_notifications', JSON.stringify(state.notifications));
        localStorage.setItem('unigigs_transactions', JSON.stringify(state.transactions));
        localStorage.setItem('unigigs_reviews', JSON.stringify(state.reviews));
        if (state.currentUser) {
            localStorage.setItem('unigigs_currentUser', JSON.stringify(state.currentUser));
        }
    }

    // 4. ROUTER & VIEW SWITCHER
    function switchView(targetViewId) {
        state.currentView = targetViewId;

        // Hide all views
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));

        // If target is auth, check or show auth
        if (targetViewId === 'auth') {
            document.getElementById('auth-view').classList.remove('hidden');
            return;
        }

        const targetEl = document.getElementById(`${targetViewId}-view`);
        if (targetEl) {
            targetEl.classList.remove('hidden');
        } else {
            document.getElementById('dashboard-view').classList.remove('hidden');
        }

        // Update active nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-target') === targetViewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger view specific renders
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 5. RENDER APP ENGINE
    function renderApp() {
        updateHeaderUI();
        updateSidebarBadges();

        switch (state.currentView) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'marketplace':
                renderMarketplace();
                break;
            case 'post-gig':
                renderPostGigForm();
                break;
            case 'my-gigs':
                renderMyGigs();
                break;
            case 'messages':
                renderMessages();
                break;
            case 'payments':
                renderPayments();
                break;
            case 'notifications':
                renderNotifications();
                break;
            case 'profile':
                renderProfile();
                break;
        }
    }

    function updateHeaderUI() {
        const userControls = document.getElementById('user-controls');
        const authButtons = document.getElementById('auth-buttons');

        if (state.currentUser) {
            userControls.classList.remove('hidden');
            authButtons.classList.add('hidden');

            document.getElementById('header-wallet-amount').textContent = `₹${state.currentUser.walletBalance}`;
            document.getElementById('header-user-avatar').src = state.currentUser.avatar;
            document.getElementById('dropdown-user-name').textContent = state.currentUser.name;
            document.getElementById('dropdown-user-email').textContent = state.currentUser.email;

            // Notification dot badge
            const unreadNotifs = state.notifications.filter(n => n.userId === state.currentUser.id && !n.isRead).length;
            const notifDot = document.getElementById('header-notif-badge');
            if (unreadNotifs > 0) {
                notifDot.classList.remove('hidden');
            } else {
                notifDot.classList.add('hidden');
            }

            // Message unread badge
            const unreadMsgs = state.messages.filter(m => m.receiverId === state.currentUser.id && !m.isRead).length;
            const msgDot = document.getElementById('header-msg-badge');
            if (unreadMsgs > 0) {
                msgDot.classList.remove('hidden');
            } else {
                msgDot.classList.add('hidden');
            }
        } else {
            userControls.classList.add('hidden');
            authButtons.classList.remove('hidden');
        }
    }

    function updateSidebarBadges() {
        const availGigs = state.gigs.filter(g => g.status === 'available').length;
        document.getElementById('marketplace-total-badge').textContent = availGigs;

        if (state.currentUser) {
            const myCount = state.gigs.filter(g => g.postedBy === state.currentUser.id || g.assignedWorker === state.currentUser.id).length;
            document.getElementById('mygigs-count-badge').textContent = myCount;

            const unreadMsgs = state.messages.filter(m => m.receiverId === state.currentUser.id && !m.isRead).length;
            document.getElementById('messages-count-badge').textContent = unreadMsgs;

            const unreadNotifs = state.notifications.filter(n => n.userId === state.currentUser.id && !n.isRead).length;
            document.getElementById('notif-count-badge').textContent = unreadNotifs;
        }
    }

    // 6. DASHBOARD RENDER
    function renderDashboard() {
        if (!state.currentUser) return;

        const user = state.currentUser;
        document.getElementById('dash-greeting-text').textContent = `Welcome back, ${user.name.split(' ')[0]}! 👋`;
        document.getElementById('dash-total-earnings').textContent = `₹${user.totalEarned}`;
        document.getElementById('dash-card-wallet-bal').textContent = `₹${user.walletBalance}`;
        document.getElementById('dash-completed-count').textContent = user.completedGigsCount;
        document.getElementById('dash-pending-payouts').textContent = `₹${user.pendingEscrow}`;

        // Active gigs where current user is poster or worker
        const activeGigs = state.gigs.filter(g => 
            (g.postedBy === user.id || g.assignedWorker === user.id) && 
            ['accepted', 'in_progress', 'submitted'].includes(g.status)
        );

        document.getElementById('dash-active-gigs-count').textContent = activeGigs.length;
        document.getElementById('dash-active-count-text').textContent = `${activeGigs.length} active gig${activeGigs.length === 1 ? '' : 's'}`;

        const activeContainer = document.getElementById('dash-active-gigs-container');
        if (activeGigs.length === 0) {
            activeContainer.innerHTML = `
                <div class="empty-state-sm text-center py-4">
                    <p class="text-muted">You have no active gigs in progress right now.</p>
                    <a href="#marketplace" class="btn btn-sm btn-outline mt-2 nav-link" data-target="marketplace">Find a Gig to Earn</a>
                </div>
            `;
        } else {
            activeContainer.innerHTML = activeGigs.map(g => createActiveGigCardHTML(g)).join('');
        }

        // Recommended Gigs
        const recommended = state.gigs.filter(g => g.status === 'available' && g.postedBy !== user.id).slice(0, 3);
        const recContainer = document.getElementById('dash-recommended-gigs');
        recContainer.innerHTML = recommended.map(g => createMiniGigCardHTML(g)).join('');

        // Recent Notifications Widget
        const notifWidget = document.getElementById('dash-notif-widget');
        const userNotifs = state.notifications.filter(n => n.userId === user.id).slice(0, 3);
        if (userNotifs.length === 0) {
            notifWidget.innerHTML = `<p class="text-muted text-center py-2" style="font-size:0.85rem">No recent notifications</p>`;
        } else {
            notifWidget.innerHTML = userNotifs.map(n => `
                <div class="notif-item-sm ${!n.isRead ? 'unread' : ''}" onclick="window.UniGigs.switchView('${n.link}')">
                    <i class="ri-notification-badge-line text-primary"></i>
                    <div>
                        <strong>${escapeHTML(n.title)}</strong>
                        <p>${escapeHTML(n.message)}</p>
                    </div>
                </div>
            `).join('');
        }

        // Top Campus Workers
        const topWorkers = state.users.slice(0, 3);
        const topContainer = document.getElementById('dash-top-workers');
        topContainer.innerHTML = topWorkers.map(w => `
            <div class="top-worker-card">
                <img src="${w.avatar}" alt="${w.name}">
                <div class="worker-meta">
                    <strong>${escapeHTML(w.name)}</strong>
                    <span class="text-muted">${escapeHTML(w.dept)}</span>
                    <span class="rating">★ ${w.rating} (${w.reviewCount} reviews)</span>
                </div>
            </div>
        `).join('');

        bindCardEvents();
    }

    function createActiveGigCardHTML(gig) {
        const isPoster = gig.postedBy === state.currentUser.id;
        const statusBadge = getStatusBadge(gig.status);
        return `
            <div class="gig-card active-gig-item" data-gig-id="${gig.id}">
                <div class="gig-card-header">
                    <span class="gig-cat-badge">${escapeHTML(gig.category)}</span>
                    ${statusBadge}
                </div>
                <h4 class="gig-card-title">${escapeHTML(gig.title)}</h4>
                <div class="gig-meta-tags">
                    <span class="meta-pill"><i class="ri-map-pin-line"></i> ${escapeHTML(gig.location)}</span>
                    <span class="meta-pill"><i class="ri-user-follow-line"></i> ${isPoster ? 'Role: Poster' : 'Role: Worker'}</span>
                </div>
                <div class="gig-card-footer">
                    <span class="gig-reward-amount">₹${gig.reward}</span>
                    <button class="btn btn-sm btn-primary btn-view-details" data-gig-id="${gig.id}">Manage Gig</button>
                </div>
            </div>
        `;
    }

    function createMiniGigCardHTML(gig) {
        return `
            <div class="gig-card mini-card" data-gig-id="${gig.id}">
                <div class="gig-card-header">
                    <span class="gig-cat-badge">${escapeHTML(gig.category)}</span>
                    <span class="gig-reward-amount">₹${gig.reward}</span>
                </div>
                <h4 class="gig-card-title" style="font-size:0.95rem">${escapeHTML(gig.title)}</h4>
                <div class="gig-meta-tags">
                    <span class="meta-pill"><i class="ri-map-pin-line"></i> ${escapeHTML(gig.location)}</span>
                </div>
                <button class="btn btn-xs btn-outline btn-view-details" data-gig-id="${gig.id}">View Details</button>
            </div>
        `;
    }

    // 7. MARKETPLACE RENDER
    function renderMarketplace() {
        let filtered = state.gigs;

        // Category Filter
        if (state.selectedCategory !== 'all') {
            filtered = filtered.filter(g => g.category.toLowerCase() === state.selectedCategory.toLowerCase());
        }

        // Search Query
        if (state.searchQuery.trim() !== '') {
            const q = state.searchQuery.toLowerCase();
            filtered = filtered.filter(g => 
                g.title.toLowerCase().includes(q) || 
                g.description.toLowerCase().includes(q) || 
                g.location.toLowerCase().includes(q)
            );
        }

        // Reward Range
        filtered = filtered.filter(g => g.reward <= state.rewardRangeMax);

        // Location Filter
        if (state.locationFilter !== 'all') {
            filtered = filtered.filter(g => g.location.toLowerCase().includes(state.locationFilter.toLowerCase()));
        }

        // Status Filter
        if (state.statusFilter === 'available') {
            filtered = filtered.filter(g => g.status === 'available');
        }

        // Sorting
        if (state.sortBy === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (state.sortBy === 'reward-high') {
            filtered.sort((a, b) => b.reward - a.reward);
        } else if (state.sortBy === 'reward-low') {
            filtered.sort((a, b) => a.reward - b.reward);
        } else if (state.sortBy === 'deadline') {
            filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        }

        const grid = document.getElementById('marketplace-gigs-grid');
        const emptyState = document.getElementById('marketplace-empty-state');

        if (filtered.length === 0) {
            grid.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            grid.classList.remove('hidden');
            emptyState.classList.add('hidden');
            grid.innerHTML = filtered.map(g => createFullGigCardHTML(g)).join('');
        }

        bindCardEvents();
    }

    function createFullGigCardHTML(gig) {
        const poster = state.users.find(u => u.id === gig.postedBy) || { name: 'Campus Student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', rating: 4.8 };
        const isSaved = state.savedGigIds.includes(gig.id);
        const statusBadge = getStatusBadge(gig.status);

        return `
            <div class="gig-card" data-gig-id="${gig.id}">
                <div class="gig-card-header">
                    <span class="gig-cat-badge">${escapeHTML(gig.category)}</span>
                    <button class="bookmark-btn ${isSaved ? 'saved' : ''}" data-gig-id="${gig.id}" title="${isSaved ? 'Remove Bookmark' : 'Bookmark Gig'}">
                        <i class="${isSaved ? 'ri-bookmark-3-fill' : 'ri-bookmark-3-line'}"></i>
                    </button>
                </div>

                <h3 class="gig-card-title">${escapeHTML(gig.title)}</h3>
                <p class="gig-card-desc">${escapeHTML(gig.description)}</p>

                <div class="gig-meta-tags">
                    <span class="meta-pill"><i class="ri-map-pin-line"></i> ${escapeHTML(gig.location)}</span>
                    <span class="meta-pill deadline"><i class="ri-time-line"></i> ${formatDeadline(gig.deadline)}</span>
                </div>

                <div class="gig-poster-snippet">
                    <img src="${poster.avatar}" alt="${poster.name}" class="gig-poster-avatar">
                    <div class="gig-poster-info">
                        <strong>${escapeHTML(poster.name)}</strong>
                        <span>★ ${poster.rating || '4.9'} • Verified Student</span>
                    </div>
                </div>

                <div class="gig-card-footer">
                    <div>
                        <span class="gig-reward-amount">₹${gig.reward}</span>
                        ${statusBadge}
                    </div>
                    <button class="btn btn-sm btn-primary btn-view-details" data-gig-id="${gig.id}">View & Apply</button>
                </div>
            </div>
        `;
    }

    // 8. GIG DETAILS MODAL RENDER & LIFECYCLE ACTIONS
    function openGigDetailsModal(gigId) {
        const gig = state.gigs.find(g => g.id === gigId);
        if (!gig) return;

        const poster = state.users.find(u => u.id === gig.postedBy) || state.currentUser;
        const worker = gig.assignedWorker ? state.users.find(u => u.id === gig.assignedWorker) : null;
        const isPoster = state.currentUser && gig.postedBy === state.currentUser.id;
        const isWorker = state.currentUser && gig.assignedWorker === state.currentUser.id;

        const modalBody = document.getElementById('gig-modal-body');

        // Render Stepper HTML
        const stepperHTML = createStepperHTML(gig.status);

        // Action buttons based on lifecycle & user role
        let actionButtonsHTML = '';
        if (state.currentUser) {
            if (gig.status === 'available') {
                if (isPoster) {
                    actionButtonsHTML = `
                        <button class="btn btn-danger btn-cancel-gig" data-gig-id="${gig.id}"><i class="ri-delete-bin-line"></i> Cancel Gig & Refund Escrow</button>
                    `;
                } else {
                    actionButtonsHTML = `
                        <button class="btn btn-primary btn-lg btn-accept-gig" data-gig-id="${gig.id}"><i class="ri-flashlight-line"></i> Accept Gig & Start Working</button>
                        <button class="btn btn-outline btn-open-chat" data-user-id="${poster.id}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat with Requester</button>
                    `;
                }
            } else if (gig.status === 'accepted' || gig.status === 'in_progress') {
                if (isWorker) {
                    actionButtonsHTML = `
                        <button class="btn btn-success btn-lg btn-trigger-submit-work" data-gig-id="${gig.id}"><i class="ri-checkbox-circle-line"></i> Submit Completed Work</button>
                        <button class="btn btn-outline btn-open-chat" data-user-id="${poster.id}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat with Requester</button>
                    `;
                } else if (isPoster) {
                    actionButtonsHTML = `
                        <button class="btn btn-outline btn-open-chat" data-user-id="${worker ? worker.id : ''}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat with Worker</button>
                        <button class="btn btn-danger btn-cancel-gig" data-gig-id="${gig.id}">Cancel & Refund</button>
                    `;
                }
            } else if (gig.status === 'submitted') {
                if (isPoster) {
                    actionButtonsHTML = `
                        <button class="btn btn-success btn-lg btn-trigger-rate-worker" data-gig-id="${gig.id}"><i class="ri-shield-check-line"></i> Confirm Completion & Release ₹${gig.reward}</button>
                        <button class="btn btn-outline btn-open-chat" data-user-id="${worker ? worker.id : ''}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat Worker</button>
                    `;
                } else if (isWorker) {
                    actionButtonsHTML = `
                        <div class="alert alert-info py-2 px-3 font-weight-bold" style="background-color:var(--primary-light); color:var(--primary); border-radius:8px">
                            <i class="ri-time-line"></i> Work Submitted! Awaiting Requester Approval & Payment Release.
                        </div>
                    `;
                }
            } else if (gig.status === 'completed') {
                actionButtonsHTML = `
                    <div class="badge badge-success p-2" style="font-size:0.9rem"><i class="ri-checkbox-circle-fill"></i> Gig Completed & Payout Released</div>
                `;
            }
        }

        modalBody.innerHTML = `
            <div class="gig-modal-header">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="gig-cat-badge">${escapeHTML(gig.category)}</span>
                    <span class="gig-reward-amount" style="font-size:1.6rem">₹${gig.reward}</span>
                </div>
                <h2>${escapeHTML(gig.title)}</h2>
                <div class="gig-meta-tags mt-2">
                    <span class="meta-pill"><i class="ri-map-pin-line"></i> ${escapeHTML(gig.location)}</span>
                    <span class="meta-pill deadline"><i class="ri-time-line"></i> ${formatDeadline(gig.deadline)}</span>
                </div>
            </div>

            <!-- LIFECYCLE STEPPER -->
            ${stepperHTML}

            <div class="gig-details-section">
                <h4>Description & Instructions</h4>
                <p style="white-space: pre-line; color: var(--text-secondary); margin-bottom:16px">${escapeHTML(gig.description)}</p>

                ${gig.requirements && gig.requirements.length > 0 ? `
                    <h4>Requirements</h4>
                    <ul class="mb-4" style="padding-left:20px; color: var(--text-secondary)">
                        ${gig.requirements.map(r => `<li>${escapeHTML(r)}</li>`).join('')}
                    </ul>
                ` : ''}

                ${gig.submissionDetails ? `
                    <div class="submission-proof-box p-3 mb-4" style="background-color:var(--bg-input); border-radius:12px; border:1px solid var(--border-color)">
                        <h4 class="text-success"><i class="ri-checkbox-circle-fill"></i> Submitted Work Proof</h4>
                        <p class="mb-1"><strong>Notes:</strong> ${escapeHTML(gig.submissionDetails.notes)}</p>
                        ${gig.submissionDetails.link ? `<p><strong>Link:</strong> <a href="${escapeHTML(gig.submissionDetails.link)}" target="_blank" class="text-primary">${escapeHTML(gig.submissionDetails.link)}</a></p>` : ''}
                    </div>
                ` : ''}

                <div class="requester-worker-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:20px 0;">
                    <div class="profile-snippet-card p-3" style="background:var(--bg-input); border-radius:12px">
                        <small class="text-muted">GIG REQUESTER</small>
                        <div class="d-flex align-items-center gap-2 mt-2">
                            <img src="${poster.avatar}" alt="${poster.name}" style="width:42px; height:42px; border-radius:50%; object-fit:cover">
                            <div>
                                <strong>${escapeHTML(poster.name)}</strong>
                                <div style="font-size:0.78rem" class="text-muted">${escapeHTML(poster.dept || 'CS Dept')}</div>
                            </div>
                        </div>
                    </div>

                    <div class="profile-snippet-card p-3" style="background:var(--bg-input); border-radius:12px">
                        <small class="text-muted">ASSIGNED WORKER</small>
                        ${worker ? `
                            <div class="d-flex align-items-center gap-2 mt-2">
                                <img src="${worker.avatar}" alt="${worker.name}" style="width:42px; height:42px; border-radius:50%; object-fit:cover">
                                <div>
                                    <strong>${escapeHTML(worker.name)}</strong>
                                    <div style="font-size:0.78rem" class="text-muted">★ ${worker.rating} Verified Worker</div>
                                </div>
                            </div>
                        ` : `
                            <p class="mt-2 text-muted" style="font-size:0.85rem">No worker assigned yet</p>
                        `}
                    </div>
                </div>
            </div>

            <div class="modal-footer-actions d-flex gap-2 justify-content-end mt-4">
                ${actionButtonsHTML}
            </div>
        `;

        document.getElementById('gig-details-modal').classList.remove('hidden');
        bindModalEvents();
    }

    function createStepperHTML(status) {
        const steps = [
            { key: 'available', label: 'Available' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'submitted', label: 'Submitted' },
            { key: 'completed', label: 'Completed' }
        ];

        let currentIndex = 0;
        if (status === 'accepted' || status === 'in_progress') currentIndex = 1;
        if (status === 'submitted') currentIndex = 2;
        if (status === 'completed') currentIndex = 3;

        return `
            <div class="gig-status-stepper">
                <div class="stepper-line">
                    <div class="stepper-line-fill" style="width: ${(currentIndex / 3) * 100}%"></div>
                </div>
                ${steps.map((step, idx) => `
                    <div class="stepper-step ${idx < currentIndex ? 'completed' : ''} ${idx === currentIndex ? 'current' : ''}">
                        <div class="step-circle">${idx < currentIndex ? '<i class="ri-check-line"></i>' : (idx + 1)}</div>
                        <span class="step-label">${step.label}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 9. POST A GIG FORM HANDLER
    function renderPostGigForm() {
        // Set minimum datetime picker to now
        const deadlineInput = document.getElementById('gig-post-deadline');
        if (deadlineInput) {
            const now = new Date();
            now.setHours(now.getHours() + 2);
            deadlineInput.value = now.toISOString().slice(0, 16);
        }
    }

    function handlePostGigSubmit(e) {
        e.preventDefault();
        if (!state.currentUser) {
            showToast('Please sign in to post a campus gig.', 'error');
            switchView('auth');
            return;
        }

        const title = document.getElementById('gig-post-title').value.trim();
        const category = document.getElementById('gig-post-category').value;
        const location = document.getElementById('gig-post-location').value;
        const description = document.getElementById('gig-post-desc').value.trim();
        const reward = parseInt(document.getElementById('gig-post-reward').value, 10);
        const deadline = document.getElementById('gig-post-deadline').value;

        if (reward > state.currentUser.walletBalance) {
            showToast(`Insufficient Escrow Balance! You need ₹${reward} in your wallet to post this gig.`, 'warning');
            switchView('payments');
            return;
        }

        // Deduct Escrow
        state.currentUser.walletBalance -= reward;
        state.currentUser.pendingEscrow += reward;

        const newGig = {
            id: 'gig_' + Date.now(),
            title,
            category,
            location,
            description,
            reward,
            deadline,
            postedBy: state.currentUser.id,
            assignedWorker: null,
            status: 'available',
            submissionDetails: null,
            requirements: ['Campus verified student'],
            createdAt: new Date().toISOString(),
            savedBy: []
        };

        state.gigs.unshift(newGig);

        // Record Transaction
        state.transactions.unshift({
            id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toLocaleString(),
            desc: `Escrow Reserve for "${title.slice(0, 25)}..."`,
            type: 'Escrow Hold',
            amount: -reward,
            status: 'Locked in Escrow'
        });

        // Add Notification
        state.notifications.unshift({
            id: 'notif_' + Date.now(),
            userId: state.currentUser.id,
            type: 'gig',
            title: 'Gig Published Successfully',
            message: `Your gig "${title}" is live for campus students. ₹${reward} reserved in Escrow.`,
            timestamp: 'Just now',
            isRead: false,
            link: 'my-gigs'
        });

        saveState();
        showToast(`Gig published! ₹${reward} held in Escrow protection.`, 'success');
        document.getElementById('post-gig-form').reset();
        switchView('my-gigs');
    }

    // 10. MY GIGS RENDER
    function renderMyGigs() {
        if (!state.currentUser) return;

        const user = state.currentUser;
        const posted = state.gigs.filter(g => g.postedBy === user.id);
        const accepted = state.gigs.filter(g => g.assignedWorker === user.id && ['accepted', 'in_progress', 'submitted'].includes(g.status));
        const completed = state.gigs.filter(g => (g.postedBy === user.id || g.assignedWorker === user.id) && g.status === 'completed');
        const saved = state.gigs.filter(g => state.savedGigIds.includes(g.id));

        document.getElementById('count-posted').textContent = posted.length;
        document.getElementById('count-accepted').textContent = accepted.length;
        document.getElementById('count-completed').textContent = completed.length;
        document.getElementById('count-saved').textContent = saved.length;

        let activeList = [];
        if (state.activeMyGigsTab === 'posted') activeList = posted;
        else if (state.activeMyGigsTab === 'accepted') activeList = accepted;
        else if (state.activeMyGigsTab === 'completed') activeList = completed;
        else if (state.activeMyGigsTab === 'saved') activeList = saved;

        const container = document.getElementById('my-gigs-container');
        const emptyBox = document.getElementById('my-gigs-empty');

        if (activeList.length === 0) {
            container.innerHTML = '';
            emptyBox.classList.remove('hidden');
        } else {
            emptyBox.classList.add('hidden');
            container.innerHTML = activeList.map(g => createFullGigCardHTML(g)).join('');
            bindCardEvents();
        }
    }

    // 11. MESSAGES & CHAT RENDER
    function renderMessages() {
        if (!state.currentUser) return;

        const user = state.currentUser;
        
        // Find all conversations involving current user
        const convosMap = {};
        state.messages.forEach(m => {
            if (m.senderId === user.id || m.receiverId === user.id) {
                const partnerId = m.senderId === user.id ? m.receiverId : m.senderId;
                if (!convosMap[m.convoId]) {
                    convosMap[m.convoId] = {
                        convoId: m.convoId,
                        partnerId: partnerId,
                        gigId: m.gigId,
                        lastMsg: m.text,
                        timestamp: m.timestamp,
                        isRead: m.isRead || m.senderId === user.id
                    };
                }
            }
        });

        const convosList = Object.values(convosMap);
        const convosContainer = document.getElementById('conversations-list-container');

        if (convosList.length === 0) {
            convosContainer.innerHTML = `<p class="text-muted text-center py-4" style="font-size:0.85rem">No active chat conversations yet</p>`;
        } else {
            convosContainer.innerHTML = convosList.map(c => {
                const partner = state.users.find(u => u.id === c.partnerId) || { name: 'Campus Student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' };
                const gig = state.gigs.find(g => g.id === c.gigId);
                const isActive = c.convoId === state.activeConvoId;
                return `
                    <div class="convo-item ${isActive ? 'active' : ''}" data-convo-id="${c.convoId}">
                        <img src="${partner.avatar}" alt="${partner.name}" class="convo-avatar">
                        <div class="convo-info">
                            <div class="convo-name-row">
                                <strong>${escapeHTML(partner.name)}</strong>
                                <span class="convo-time">Just now</span>
                            </div>
                            ${gig ? `<span class="convo-gig-snippet">Gig: ${escapeHTML(gig.title.slice(0, 22))}...</span>` : ''}
                            <p class="convo-last-msg">${escapeHTML(c.lastMsg)}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render Active Message Thread
        renderActiveChatThread();
    }

    function renderActiveChatThread() {
        const activeMsgs = state.messages.filter(m => m.convoId === state.activeConvoId);
        const body = document.getElementById('chat-messages-body');

        if (activeMsgs.length === 0) {
            body.innerHTML = `
                <div class="chat-placeholder">
                    <i class="ri-chat-smile-2-line"></i>
                    <p>No messages yet. Send a greeting to start chatting!</p>
                </div>
            `;
            return;
        }

        const firstMsg = activeMsgs[0];
        const partnerId = firstMsg.senderId === state.currentUser.id ? firstMsg.receiverId : firstMsg.senderId;
        const partner = state.users.find(u => u.id === partnerId) || { name: 'Student', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' };
        const gig = state.gigs.find(g => g.id === firstMsg.gigId);

        document.getElementById('chat-partner-name').textContent = partner.name;
        document.getElementById('chat-partner-avatar').src = partner.avatar;
        document.getElementById('chat-gig-title-tag').textContent = gig ? `Gig: ${gig.title}` : 'Campus Direct Chat';

        body.innerHTML = activeMsgs.map(m => {
            const isSent = m.senderId === state.currentUser.id;
            return `
                <div class="message-bubble-wrapper ${isSent ? 'sent' : 'received'}">
                    <div class="msg-bubble">${escapeHTML(m.text)}</div>
                    <span class="msg-time">${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            `;
        }).join('');

        body.scrollTop = body.scrollHeight;
    }

    function handleSendChatMessage(e) {
        e.preventDefault();
        const input = document.getElementById('chat-input-field');
        const text = input.value.trim();
        if (!text || !state.currentUser) return;

        const activeMsgs = state.messages.filter(m => m.convoId === state.activeConvoId);
        let partnerId = 'usr_2';
        let gigId = 'gig_2';

        if (activeMsgs.length > 0) {
            partnerId = activeMsgs[0].senderId === state.currentUser.id ? activeMsgs[0].receiverId : activeMsgs[0].senderId;
            gigId = activeMsgs[0].gigId;
        }

        const newMsg = {
            id: 'msg_' + Date.now(),
            convoId: state.activeConvoId,
            gigId: gigId,
            senderId: state.currentUser.id,
            receiverId: partnerId,
            text: text,
            timestamp: new Date().toISOString(),
            isRead: true
        };

        state.messages.push(newMsg);
        input.value = '';
        saveState();
        renderMessages();
    }

    // 12. PAYMENTS & UPI ESCROW RENDER
    function renderPayments() {
        if (!state.currentUser) return;

        document.getElementById('payment-page-balance').textContent = `₹${state.currentUser.walletBalance}`;
        document.getElementById('payment-page-earned').textContent = `₹${state.currentUser.totalEarned}`;
        document.getElementById('payment-page-pending').textContent = `₹${state.currentUser.pendingEscrow}`;

        const tbody = document.getElementById('transactions-table-body');
        tbody.innerHTML = state.transactions.map(t => `
            <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.date}</td>
                <td>${escapeHTML(t.desc)}</td>
                <td><span class="badge ${t.amount > 0 ? 'badge-success' : 'badge-warning'}">${t.type}</span></td>
                <td style="font-weight:700; color: ${t.amount > 0 ? 'var(--accent)' : 'var(--text-primary)'}">${t.amount > 0 ? '+' : ''}₹${Math.abs(t.amount)}</td>
                <td><span class="badge badge-success">${t.status}</span></td>
            </tr>
        `).join('');
    }

    function handleUPIPaymentSubmit(e) {
        e.preventDefault();
        const actionType = document.getElementById('upi-action-type').value;
        const amount = parseInt(document.getElementById('upi-amount-input').value, 10);
        const upiId = document.getElementById('upi-vpa-input').value;

        if (amount <= 0 || isNaN(amount)) {
            showToast('Please enter a valid payment amount.', 'warning');
            return;
        }

        if (actionType === 'deposit') {
            state.currentUser.walletBalance += amount;
            state.transactions.unshift({
                id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
                date: new Date().toLocaleString(),
                desc: `UPI Deposit via ${upiId}`,
                type: 'Deposits',
                amount: amount,
                status: 'Completed'
            });
            showToast(`₹${amount} added successfully to your Escrow wallet!`, 'success');
        } else {
            if (amount > state.currentUser.walletBalance) {
                showToast('Insufficient wallet balance to withdraw this amount.', 'error');
                return;
            }
            state.currentUser.walletBalance -= amount;
            state.transactions.unshift({
                id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
                date: new Date().toLocaleString(),
                desc: `UPI Payout Withdrawal to ${upiId}`,
                type: 'Withdrawal',
                amount: -amount,
                status: 'Completed'
            });
            showToast(`₹${amount} transferred to your UPI account (${upiId})!`, 'success');
        }

        saveState();
        document.getElementById('upi-payment-modal').classList.add('hidden');
        renderApp();
    }

    // 13. NOTIFICATIONS RENDER
    function renderNotifications() {
        if (!state.currentUser) return;

        const userNotifs = state.notifications.filter(n => n.userId === state.currentUser.id);
        const container = document.getElementById('notifications-full-list');

        document.getElementById('notif-count-all').textContent = userNotifs.length;

        if (userNotifs.length === 0) {
            container.innerHTML = `<div class="empty-state-box text-center py-5"><p class="text-muted">No notifications yet.</p></div>`;
            return;
        }

        container.innerHTML = userNotifs.map(n => `
            <div class="content-card notif-card-item ${!n.isRead ? 'border-primary' : ''}" style="margin-bottom:12px; padding:16px;" onclick="window.UniGigs.switchView('${n.link}')">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                        <i class="ri-notification-badge-fill text-primary" style="font-size:1.5rem"></i>
                        <div>
                            <strong style="font-size:1rem">${escapeHTML(n.title)}</strong>
                            <p style="font-size:0.88rem; color:var(--text-secondary)" class="mb-0">${escapeHTML(n.message)}</p>
                        </div>
                    </div>
                    <span class="text-muted" style="font-size:0.78rem">${n.timestamp}</span>
                </div>
            </div>
        `).join('');
    }

    // 14. PROFILE RENDER
    function renderProfile() {
        if (!state.currentUser) return;

        const user = state.currentUser;
        document.getElementById('profile-page-name').textContent = user.name;
        document.getElementById('profile-page-dept').textContent = `${user.dept} • ${user.year}`;
        document.getElementById('profile-page-campus').innerHTML = `<i class="ri-building-4-line"></i> ${user.campus || 'SASTRA Deemed University, Thanjavur'}`;
        document.getElementById('profile-page-avatar').src = user.avatar;
        document.getElementById('profile-page-rating').textContent = `${user.rating} ★`;
        document.getElementById('profile-page-completed').textContent = user.completedGigsCount;
        document.getElementById('profile-page-earned').textContent = `₹${user.totalEarned}`;
        document.getElementById('profile-page-bio').textContent = user.bio;
        document.getElementById('profile-page-email').textContent = user.email;
        document.getElementById('profile-page-upi').textContent = user.upiId || 'Not connected';

        // Render Reviews
        const userReviews = state.reviews.filter(r => r.targetUserId === user.id);
        const reviewsContainer = document.getElementById('profile-reviews-list');
        document.getElementById('profile-reviews-count').textContent = userReviews.length;

        reviewsContainer.innerHTML = userReviews.map(r => `
            <div class="content-card p-3 mb-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <img src="${r.reviewerAvatar}" style="width:36px; height:36px; border-radius:50%; object-fit:cover">
                        <div>
                            <strong>${escapeHTML(r.reviewerName)}</strong>
                            <div class="stars-gold" style="font-size:0.8rem">★ ${r.rating}.0</div>
                        </div>
                    </div>
                    <span class="text-muted" style="font-size:0.75rem">${r.date}</span>
                </div>
                <p style="font-size:0.88rem; color:var(--text-secondary)">${escapeHTML(r.text)}</p>
            </div>
        `).join('');
    }

    function handleEditProfileSubmit(e) {
        e.preventDefault();
        if (!state.currentUser) return;

        state.currentUser.name = document.getElementById('edit-name').value.trim();
        state.currentUser.dept = document.getElementById('edit-dept').value.trim();
        state.currentUser.bio = document.getElementById('edit-bio').value.trim();
        state.currentUser.upiId = document.getElementById('edit-upi').value.trim();

        saveState();
        showToast('Profile updated successfully!', 'success');
        renderProfile();
    }

    // 15. AUTH HANDLERS
    function handleLoginSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const pass = document.getElementById('login-password').value;

        const found = state.users.find(u => u.email.toLowerCase() === email);
        if (found) {
            state.currentUser = found;
            saveState();
            showToast(`Welcome back, ${found.name}!`, 'success');
            switchView('dashboard');
        } else {
            showToast('Invalid college email or password.', 'error');
        }
    }

    function handleSignupSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim().toLowerCase();
        const dept = document.getElementById('signup-dept').value.trim();
        const year = document.getElementById('signup-year').value;
        const upi = document.getElementById('signup-upi').value.trim();
        const pass = document.getElementById('signup-password').value;

        if (!email.endsWith('.edu') && !email.endsWith('.ac.in') && !email.endsWith('.edu.in')) {
            showToast('Please use your official college email domain (.edu or .ac.in).', 'warning');
            return;
        }

        const newUser = {
            id: 'usr_' + Date.now(),
            name,
            email,
            password: pass,
            dept,
            year,
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: `Verified student in ${dept}.`,
            skills: ['General Tasks'],
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            walletBalance: 500, // Sign up bonus
            pendingEscrow: 0,
            totalEarned: 0,
            rating: 5.0,
            reviewCount: 0,
            completedGigsCount: 0,
            upiId: upi || 'student@upi',
            isVerified: true
        };

        state.users.push(newUser);
        state.currentUser = newUser;
        saveState();
        showToast('Account created & student status verified! Bonus ₹500 added.', 'success');
        switchView('dashboard');
    }

    // 16. TOAST SYSTEM
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'ri-information-line';
        if (type === 'success') icon = 'ri-checkbox-circle-line';
        if (type === 'error') icon = 'ri-error-warning-line';
        if (type === 'warning') icon = 'ri-alert-line';

        toast.innerHTML = `
            <i class="${icon}"></i>
            <span>${escapeHTML(message)}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // 17. EVENT BINDINGS
    function bindGlobalEvents() {
        // Navigation Links
        document.addEventListener('click', e => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                const target = navLink.getAttribute('data-target');
                if (target) switchView(target);
            }
        });

        // Header Log In & Sign Up Buttons
        document.getElementById('header-login-btn')?.addEventListener('click', () => {
            switchView('auth');
            document.getElementById('tab-login-btn')?.click();
        });
        document.getElementById('header-signup-btn')?.addEventListener('click', () => {
            switchView('auth');
            document.getElementById('tab-signup-btn')?.click();
        });

        // Mobile Sidebar Toggle
        document.getElementById('sidebar-toggle-btn')?.addEventListener('click', e => {
            e.stopPropagation();
            document.getElementById('app-sidebar')?.classList.toggle('active');
        });

        // Global Search Bar & Clear
        const globalSearchInput = document.getElementById('global-search-input');
        const globalSearchClear = document.getElementById('global-search-clear');
        globalSearchInput?.addEventListener('input', e => {
            const val = e.target.value;
            if (val.trim() !== '') {
                globalSearchClear?.classList.remove('hidden');
            } else {
                globalSearchClear?.classList.add('hidden');
            }
            state.searchQuery = val;
            const marketSearch = document.getElementById('market-search-field');
            if (marketSearch) marketSearch.value = val;
            if (state.currentView !== 'marketplace') {
                switchView('marketplace');
            } else {
                renderMarketplace();
            }
        });

        globalSearchClear?.addEventListener('click', () => {
            if (globalSearchInput) globalSearchInput.value = '';
            globalSearchClear.classList.add('hidden');
            state.searchQuery = '';
            const marketSearch = document.getElementById('market-search-field');
            if (marketSearch) marketSearch.value = '';
            renderMarketplace();
        });

        // Theme Toggle
        document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const icon = document.getElementById('theme-icon');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'ri-sun-line';
            } else {
                icon.className = 'ri-moon-line';
            }
        });

        // Avatar Dropdown Toggle
        const avatarTrigger = document.getElementById('user-avatar-trigger');
        const dropdown = document.getElementById('avatar-dropdown');
        avatarTrigger?.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => dropdown?.classList.add('hidden'));

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            state.currentUser = null;
            saveState();
            showToast('You have signed out.', 'info');
            switchView('auth');
        });

        // Auth Tabs
        document.getElementById('tab-login-btn')?.addEventListener('click', () => {
            document.getElementById('tab-login-btn').classList.add('active');
            document.getElementById('tab-signup-btn').classList.remove('active');
            document.getElementById('login-form').classList.remove('hidden');
            document.getElementById('signup-form').classList.add('hidden');
            document.getElementById('forgot-form')?.classList.add('hidden');
        });

        document.getElementById('tab-signup-btn')?.addEventListener('click', () => {
            document.getElementById('tab-signup-btn').classList.add('active');
            document.getElementById('tab-login-btn').classList.remove('active');
            document.getElementById('signup-form').classList.remove('hidden');
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('forgot-form')?.classList.add('hidden');
        });

        // Toggle Password Visibility Eye Buttons
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                const wrapper = btn.closest('.input-icon-wrapper');
                const input = wrapper?.querySelector('input');
                const icon = btn.querySelector('i');
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        if (icon) icon.className = 'ri-eye-off-line';
                    } else {
                        input.type = 'password';
                        if (icon) icon.className = 'ri-eye-line';
                    }
                }
            });
        });

        // Forgot Password Navigation & Submit
        document.getElementById('forgot-password-link')?.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('login-form')?.classList.add('hidden');
            document.getElementById('forgot-form')?.classList.remove('hidden');
        });
        document.getElementById('back-to-login')?.addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('forgot-form')?.classList.add('hidden');
            document.getElementById('login-form')?.classList.remove('hidden');
        });
        document.getElementById('forgot-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('forgot-email')?.value || 'regno@sastra.ac.in';
            showToast(`Password reset link sent to ${email}`, 'success');
            document.getElementById('forgot-form')?.classList.add('hidden');
            document.getElementById('login-form')?.classList.remove('hidden');
        });

        // Student ID Upload Dropzone
        const idDropzone = document.getElementById('signup-id-dropzone');
        const idInput = document.getElementById('signup-id-input');
        const idPreview = document.getElementById('signup-id-preview');
        const removePreviewBtn = document.getElementById('remove-id-preview');

        idDropzone?.addEventListener('click', () => idInput?.click());
        idInput?.addEventListener('change', e => {
            if (e.target.files && e.target.files[0]) {
                document.getElementById('id-filename').textContent = e.target.files[0].name;
                idDropzone.classList.add('hidden');
                idPreview?.classList.remove('hidden');
            }
        });
        removePreviewBtn?.addEventListener('click', e => {
            e.stopPropagation();
            if (idInput) idInput.value = '';
            idPreview?.classList.add('hidden');
            idDropzone?.classList.remove('hidden');
        });

        // Demo login shortcuts
        document.getElementById('demo-user-1')?.addEventListener('click', () => {
            document.getElementById('login-email').value = 'regno@sastra.ac.in';
            document.getElementById('login-password').value = 'password123';
        });

        document.getElementById('demo-user-2')?.addEventListener('click', () => {
            document.getElementById('login-email').value = 'ananya.math23@sastra.ac.in';
            document.getElementById('login-password').value = 'password123';
        });

        // Forms
        document.getElementById('login-form')?.addEventListener('submit', handleLoginSubmit);
        document.getElementById('signup-form')?.addEventListener('submit', handleSignupSubmit);
        document.getElementById('post-gig-form')?.addEventListener('submit', handlePostGigSubmit);
        document.getElementById('chat-send-form')?.addEventListener('submit', handleSendChatMessage);
        document.getElementById('upi-payment-form')?.addEventListener('submit', handleUPIPaymentSubmit);
        document.getElementById('edit-profile-form')?.addEventListener('submit', handleEditProfileSubmit);

        // Search in Marketplace
        document.getElementById('market-search-field')?.addEventListener('input', e => {
            state.searchQuery = e.target.value;
            renderMarketplace();
        });

        document.getElementById('market-sort-by')?.addEventListener('change', e => {
            state.sortBy = e.target.value;
            renderMarketplace();
        });

        // Category Chips
        document.getElementById('category-chips-container')?.addEventListener('click', e => {
            const chip = e.target.closest('.cat-chip');
            if (chip) {
                document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                state.selectedCategory = chip.getAttribute('data-category');
                renderMarketplace();
            }
        });

        // My Gigs Tabs
        document.querySelectorAll('.my-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.my-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.activeMyGigsTab = btn.getAttribute('data-tab');
                renderMyGigs();
            });
        });

        // Profile Tabs
        document.querySelectorAll('.profile-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.getAttribute('data-prof-tab');
                document.querySelectorAll('.prof-tab-pane').forEach(pane => pane.classList.add('hidden'));
                document.getElementById(`prof-tab-${tab}`).classList.remove('hidden');
            });
        });

        // UPI Modal Openers
        document.getElementById('open-upi-deposit-modal')?.addEventListener('click', () => {
            document.getElementById('upi-modal-title').innerHTML = '<i class="ri-qr-code-line"></i> Add Escrow Funds';
            document.getElementById('upi-action-type').value = 'deposit';
            document.getElementById('upi-payment-modal').classList.remove('hidden');
        });

        document.getElementById('open-upi-withdraw-modal')?.addEventListener('click', () => {
            document.getElementById('upi-modal-title').innerHTML = '<i class="ri-bank-card-line"></i> Withdraw Earnings to UPI';
            document.getElementById('upi-action-type').value = 'withdraw';
            document.getElementById('upi-payment-modal').classList.remove('hidden');
        });

        // Modal Close & Cancel Buttons
        document.getElementById('close-gig-modal-btn')?.addEventListener('click', () => {
            document.getElementById('gig-details-modal').classList.add('hidden');
        });
        document.getElementById('close-upi-modal')?.addEventListener('click', () => {
            document.getElementById('upi-payment-modal').classList.add('hidden');
        });
        document.getElementById('close-submit-work-modal')?.addEventListener('click', () => {
            document.getElementById('submit-work-modal').classList.add('hidden');
        });
        document.getElementById('close-rate-worker-modal')?.addEventListener('click', () => {
            document.getElementById('rate-worker-modal').classList.add('hidden');
        });
        document.getElementById('cancel-submit-work')?.addEventListener('click', () => {
            document.getElementById('submit-work-modal')?.classList.add('hidden');
        });
        document.getElementById('cancel-rate-modal')?.addEventListener('click', () => {
            document.getElementById('rate-worker-modal')?.classList.add('hidden');
        });
        document.getElementById('confirm-cancel-btn')?.addEventListener('click', () => {
            document.getElementById('confirm-modal')?.classList.add('hidden');
        });
        document.getElementById('close-filter-modal')?.addEventListener('click', () => {
            document.getElementById('filter-modal')?.classList.add('hidden');
        });

        // Filter Modal Controls
        document.getElementById('filter-reward-range')?.addEventListener('input', e => {
            document.getElementById('reward-max-label').textContent = `Up to ₹${e.target.value}`;
        });
        document.getElementById('filter-apply-btn')?.addEventListener('click', () => {
            const val = parseInt(document.getElementById('filter-reward-range').value, 10);
            const loc = document.getElementById('filter-location-select').value;
            const status = document.getElementById('filter-status-select').value;
            state.rewardRangeMax = val;
            state.locationFilter = loc;
            state.statusFilter = status;
            document.getElementById('filter-modal')?.classList.add('hidden');
            if (state.currentView !== 'marketplace') {
                switchView('marketplace');
            } else {
                renderMarketplace();
            }
            showToast('Gig filters applied!', 'info');
        });
        document.getElementById('filter-reset-btn')?.addEventListener('click', () => {
            document.getElementById('filter-reward-range').value = 2000;
            document.getElementById('reward-max-label').textContent = 'Up to ₹2000';
            document.getElementById('filter-location-select').value = 'all';
            document.getElementById('filter-status-select').value = 'available';
            state.rewardRangeMax = 2000;
            state.locationFilter = 'all';
            state.statusFilter = 'available';
            renderMarketplace();
            showToast('Filters reset to default.', 'info');
        });

        // Star Rating Picker
        const starPicker = document.getElementById('star-picker');
        starPicker?.addEventListener('click', e => {
            const star = e.target.closest('.star-item');
            if (star) {
                const val = parseInt(star.getAttribute('data-rating'), 10);
                document.getElementById('selected-star-val').value = val;
                const stars = starPicker.querySelectorAll('.star-item');
                stars.forEach((s, idx) => {
                    if (idx < val) s.classList.add('active');
                    else s.classList.remove('active');
                });
            }
        });

        // Submit Work Form
        document.getElementById('submit-work-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const gigId = document.getElementById('submit-work-gig-id').value;
            const notes = document.getElementById('submit-work-notes').value.trim();
            const link = document.getElementById('submit-work-link').value.trim();

            const gig = state.gigs.find(g => g.id === gigId);
            if (gig) {
                gig.status = 'submitted';
                gig.submissionDetails = { notes, link };
                saveState();
                showToast('Work submitted successfully to requester!', 'success');
                document.getElementById('submit-work-modal').classList.add('hidden');
                document.getElementById('gig-details-modal').classList.add('hidden');
                renderApp();
            }
        });

        // Rate Worker Form
        document.getElementById('rate-worker-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const gigId = document.getElementById('rate-gig-id').value;
            const rating = parseInt(document.getElementById('selected-star-val').value, 10);
            const reviewText = document.getElementById('review-text-input').value.trim();

            const gig = state.gigs.find(g => g.id === gigId);
            if (gig && state.currentUser) {
                gig.status = 'completed';

                // Release payout to worker
                const worker = state.users.find(u => u.id === gig.assignedWorker);
                if (worker) {
                    worker.walletBalance += gig.reward;
                    worker.totalEarned += gig.reward;
                    worker.completedGigsCount += 1;
                }

                state.currentUser.pendingEscrow = Math.max(0, state.currentUser.pendingEscrow - gig.reward);

                // Add Review
                state.reviews.unshift({
                    id: 'rev_' + Date.now(),
                    targetUserId: gig.assignedWorker,
                    reviewerName: state.currentUser.name,
                    reviewerAvatar: state.currentUser.avatar,
                    rating: rating,
                    date: 'Today',
                    text: reviewText
                });

                saveState();
                showToast(`Gig completed! ₹${gig.reward} payout released to worker.`, 'success');
                document.getElementById('rate-worker-modal').classList.add('hidden');
                document.getElementById('gig-details-modal').classList.add('hidden');
                renderApp();
            }
        });
    }

    function bindCardEvents() {
        // View Details Button
        document.querySelectorAll('.btn-view-details').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = btn.getAttribute('data-gig-id');
                openGigDetailsModal(id);
            });
        });

        // Bookmark Toggle
        document.querySelectorAll('.bookmark-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const id = btn.getAttribute('data-gig-id');
                if (state.savedGigIds.includes(id)) {
                    state.savedGigIds = state.savedGigIds.filter(gId => gId !== id);
                    showToast('Gig removed from bookmarks', 'info');
                } else {
                    state.savedGigIds.push(id);
                    showToast('Gig saved to bookmarks!', 'success');
                }
                saveState();
                renderApp();
            });
        });
    }

    function bindModalEvents() {
        // Accept Gig Button
        document.querySelector('.btn-accept-gig')?.addEventListener('click', e => {
            const gigId = e.target.closest('button').getAttribute('data-gig-id');
            const gig = state.gigs.find(g => g.id === gigId);
            if (gig && state.currentUser) {
                gig.assignedWorker = state.currentUser.id;
                gig.status = 'in_progress';
                saveState();
                showToast('Gig accepted! You can now start working and chat with requester.', 'success');
                document.getElementById('gig-details-modal').classList.add('hidden');
                switchView('my-gigs');
            }
        });

        // Cancel Gig Button
        document.querySelectorAll('.btn-cancel-gig').forEach(btn => {
            btn.addEventListener('click', e => {
                const gigId = e.target.closest('button').getAttribute('data-gig-id');
                const gig = state.gigs.find(g => g.id === gigId);
                if (gig && state.currentUser && gig.postedBy === state.currentUser.id) {
                    gig.status = 'cancelled';
                    state.currentUser.walletBalance += gig.reward;
                    state.currentUser.pendingEscrow = Math.max(0, state.currentUser.pendingEscrow - gig.reward);

                    state.transactions.unshift({
                        id: 'TXN-' + Math.floor(1000 + Math.random() * 9000),
                        date: new Date().toLocaleString(),
                        desc: `Escrow Refund for "${gig.title.slice(0, 25)}..."`,
                        type: 'Refund',
                        amount: gig.reward,
                        status: 'Completed'
                    });

                    saveState();
                    showToast(`Gig cancelled. ₹${gig.reward} refunded to your wallet balance.`, 'info');
                    document.getElementById('gig-details-modal')?.classList.add('hidden');
                    renderApp();
                }
            });
        });

        // Open Chat Button
        document.querySelectorAll('.btn-open-chat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('gig-details-modal').classList.add('hidden');
                switchView('messages');
            });
        });

        // Trigger Submit Work
        document.querySelector('.btn-trigger-submit-work')?.addEventListener('click', e => {
            const gigId = e.target.closest('button').getAttribute('data-gig-id');
            document.getElementById('submit-work-gig-id').value = gigId;
            document.getElementById('submit-work-modal').classList.remove('hidden');
        });

        // Trigger Rate Worker
        document.querySelector('.btn-trigger-rate-worker')?.addEventListener('click', e => {
            const gigId = e.target.closest('button').getAttribute('data-gig-id');
            const gig = state.gigs.find(g => g.id === gigId);
            if (gig) {
                document.getElementById('rate-gig-id').value = gigId;
                document.getElementById('release-amount-text').textContent = `₹${gig.reward}`;
                document.getElementById('rate-worker-modal').classList.remove('hidden');
            }
        });
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getStatusBadge(status) {
        switch (status) {
            case 'available': return '<span class="badge badge-success">Available</span>';
            case 'in_progress':
            case 'accepted': return '<span class="badge badge-warning">In Progress</span>';
            case 'submitted': return '<span class="badge badge-primary">Submitted</span>';
            case 'completed': return '<span class="badge badge-success">Completed</span>';
            default: return `<span class="badge badge-primary">${status}</span>`;
        }
    }

    function formatDeadline(isoString) {
        if (!isoString) return 'No deadline';
        const d = new Date(isoString);
        return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // 18. INIT
    document.addEventListener('DOMContentLoaded', () => {
        loadState();
        bindGlobalEvents();
        switchView('dashboard');
    });

    // Expose public global helper for inline calls
    window.UniGigs = {
        switchView,
        showToast
    };

})();
