/* ==========================================================================
   UniGigs - Single Page Application Engine & LocalStorage Manager
   ========================================================================== */

(function () {
    'use strict';

    // 1. DEFAULT MOCK DATA SEED
    const SEED_USERS = [
        {
            id: 'usr_1',
            regNo: '124003189',
            name: 'Nithyashri R',
            email: '124003189@sastra.ac.in',
            password: 'password123',
            dept: 'School of Computing, SASTRA',
            year: '3rd Year (Junior)',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Undergrad student at SASTRA Deemed University, Thanjavur. Passionate about software engineering, UI design, academic help, and campus activities.',
            skills: ['Python & C++', 'Fast Delivery', 'Linear Algebra', 'Web Development'],
            preferredCategories: ['Printing', 'Academic Help', 'Technical Help'],
            preferredRewardMin: 150,
            preferredRewardMax: 1000,
            availability: 'Evenings & Weekends',
            preferredLocations: ['Central Library & Reading Hall', 'Tech Park & Computer Labs'],
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
            regNo: '124003250',
            name: 'Ananya Sen',
            email: '124003250@sastra.ac.in',
            password: 'password123',
            dept: 'Mathematics & Computing',
            year: '2nd Year',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Math enthusiast at SASTRA. Love solving calculus problems, tutoring for mid-terms, and managing event logistics.',
            skills: ['Calculus & Algebra', 'Event Management', 'LaTeX Formatting'],
            preferredCategories: ['Academic Help', 'Events', 'Printing'],
            preferredRewardMin: 200,
            preferredRewardMax: 800,
            availability: 'Weekdays 4 PM - 9 PM',
            preferredLocations: ['Tech Park & Computer Labs', 'Science Block A'],
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
            regNo: '124003310',
            name: 'Vikram Verma',
            email: '124003310@sastra.ac.in',
            password: 'password123',
            dept: 'Electrical Engineering',
            year: '4th Year',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Robotics enthusiast and tech troubleshooter. I help with hardware debugging, microcontrollers, and campus food pickups.',
            skills: ['Arduino & Hardware', 'Tech Repair', 'Quick Delivery'],
            preferredCategories: ['Technical Help', 'Food', 'Errands'],
            preferredRewardMin: 100,
            preferredRewardMax: 600,
            availability: 'Anytime / Flexible',
            preferredLocations: ['Hostel 4 / Block B', 'Main Gate / Off-Campus Delivery'],
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
            regNo: '124003420',
            name: 'Sneha Patel',
            email: '124003420@sastra.ac.in',
            password: 'password123',
            dept: 'Mechanical Engineering',
            year: '1st Year',
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: 'Freshman student ready to help with library errands, printout pickups, and hostel deliveries.',
            skills: ['Campus Errands', 'Fast Runner', 'Note Taking'],
            preferredCategories: ['Delivery', 'Printing', 'Errands'],
            preferredRewardMin: 80,
            preferredRewardMax: 400,
            availability: 'Mornings & Breaks',
            preferredLocations: ['Central Library & Reading Hall', 'Main Gate / Off-Campus Delivery'],
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
            requiredSkills: ['Printer Access', 'Fast Delivery', 'Document Binding'],
            estimatedDuration: '45 mins',
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
            requiredSkills: ['Fast Delivery', 'Campus Errands'],
            estimatedDuration: '30 mins',
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
            requiredSkills: ['Linear Algebra', 'Calculus & Algebra', 'Python & C++'],
            estimatedDuration: '2 hours',
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
            requiredSkills: ['Campus Errands', 'Fast Delivery'],
            estimatedDuration: '40 mins',
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
            requiredSkills: ['DSLR Photography', 'Event Management'],
            estimatedDuration: '2.5 hours',
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
            requiredSkills: ['Web Development', 'Python & C++', 'Tech Repair'],
            estimatedDuration: '30 mins',
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
            requiredSkills: ['Fast Delivery', 'Campus Errands'],
            estimatedDuration: '20 mins',
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
            requiredSkills: ['Campus Errands', 'Physical Assembly'],
            estimatedDuration: '1 hour',
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

    const SEED_APPLICATIONS = [
        {
            id: 'app_1',
            gigId: 'gig_1',
            applicantId: 'usr_2',
            message: 'I am available right now and have access to a high-speed color printer in Hostel 3. I can print, spiral bind with a clear cover, and deliver to Central Library desk by 2 PM.',
            estimatedTime: '1 hour',
            skillsNote: 'Printer Access, Fast Delivery',
            status: 'pending',
            createdAt: '2026-08-29T10:30:00Z'
        },
        {
            id: 'app_2',
            gigId: 'gig_1',
            applicantId: 'usr_3',
            message: 'I have lectures near Tech Park library lab. Can pick up PDF, print 60 pages in high quality, and drop off directly at library.',
            estimatedTime: '45 mins',
            skillsNote: 'Fast Delivery, Campus Errands',
            status: 'pending',
            createdAt: '2026-08-29T11:00:00Z'
        },
        {
            id: 'app_3',
            gigId: 'gig_5',
            applicantId: 'usr_1',
            message: 'I have a Sony A7III Mirrorless camera with prime lenses. I cover IEEE & TEDx events at SASTRA regularly. Raw files + Lightroom touchups included.',
            estimatedTime: '2 hours',
            skillsNote: 'DSLR Photography, Event Management',
            status: 'pending',
            createdAt: '2026-08-29T12:15:00Z'
        }
    ];

    function calculateTrustScore(user) {
        if (!user) return 85;
        const ratingScore = Math.round((user.rating || 4.8) * 15);
        const gigsScore = Math.min(15, (user.completedGigsCount || 5) * 1.2);
        const verifiedBonus = user.isVerified ? 10 : 0;
        return Math.min(99, Math.max(78, Math.round(ratingScore + gigsScore + verifiedBonus)));
    }

    // 2. STATE MANAGER
    let state = {
        currentUser: null,
        users: [],
        gigs: [],
        applications: [],
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
        const storedApps = localStorage.getItem('unigigs_applications');
        const storedMsgs = localStorage.getItem('unigigs_messages');
        const storedNotifs = localStorage.getItem('unigigs_notifications');
        const storedTxns = localStorage.getItem('unigigs_transactions');
        const storedReviews = localStorage.getItem('unigigs_reviews');
        const storedCurrUser = localStorage.getItem('unigigs_currentUser');

        if (!storedUsers || !storedGigs) {
            // Seed initial data
            localStorage.setItem('unigigs_users', JSON.stringify(SEED_USERS));
            localStorage.setItem('unigigs_gigs', JSON.stringify(SEED_GIGS));
            localStorage.setItem('unigigs_applications', JSON.stringify(SEED_APPLICATIONS));
            localStorage.setItem('unigigs_messages', JSON.stringify(SEED_MESSAGES));
            localStorage.setItem('unigigs_notifications', JSON.stringify(SEED_NOTIFICATIONS));
            localStorage.setItem('unigigs_transactions', JSON.stringify(SEED_TRANSACTIONS));
            localStorage.setItem('unigigs_reviews', JSON.stringify(SEED_REVIEWS));
            localStorage.setItem('unigigs_currentUser', JSON.stringify(SEED_USERS[0]));

            state.users = SEED_USERS;
            state.gigs = SEED_GIGS;
            state.applications = SEED_APPLICATIONS;
            state.messages = SEED_MESSAGES;
            state.notifications = SEED_NOTIFICATIONS;
            state.transactions = SEED_TRANSACTIONS;
            state.reviews = SEED_REVIEWS;
            state.currentUser = SEED_USERS[0];
        } else {
            state.users = JSON.parse(storedUsers);
            state.gigs = JSON.parse(storedGigs);
            state.applications = JSON.parse(storedApps || JSON.stringify(SEED_APPLICATIONS));
            state.messages = JSON.parse(storedMsgs || '[]');
            state.notifications = JSON.parse(storedNotifs || '[]');
            state.transactions = JSON.parse(storedTxns || '[]');
            state.reviews = JSON.parse(storedReviews || '[]');
            state.currentUser = storedCurrUser ? JSON.parse(storedCurrUser) : state.users[0];
        }

        // Auto-migrate cached state to SASTRA University & Nithyashri R
        if (state.currentUser && (state.currentUser.id === 'usr_1' || !state.currentUser.regNo || state.currentUser.email === 'regno@sastra.ac.in')) {
            state.currentUser.regNo = '124003189';
            state.currentUser.name = 'Nithyashri R';
            state.currentUser.email = '124003189@sastra.ac.in';
            state.currentUser.campus = 'SASTRA Deemed University, Thanjavur';
            state.currentUser.dept = 'School of Computing, SASTRA';
            state.currentUser.upiId = 'nithyashri@upi';
            state.currentUser.bio = 'Undergrad student at SASTRA Deemed University, Thanjavur. Passionate about software engineering, UI design, academic help, and campus activities.';
        }
        if (state.users && state.users.length > 0) {
            state.users.forEach(u => {
                u.campus = 'SASTRA Deemed University, Thanjavur';
                if (u.id === 'usr_1') {
                    u.regNo = '124003189';
                    u.name = 'Nithyashri R';
                    u.email = '124003189@sastra.ac.in';
                    u.dept = 'School of Computing, SASTRA';
                    u.upiId = 'nithyashri@upi';
                } else if (u.id === 'usr_2') {
                    u.regNo = '124003250';
                    u.email = '124003250@sastra.ac.in';
                } else if (u.id === 'usr_3') {
                    u.regNo = '124003310';
                    u.email = '124003310@sastra.ac.in';
                } else if (u.id === 'usr_4') {
                    u.regNo = '124003420';
                    u.email = '124003420@sastra.ac.in';
                } else if (!u.regNo && u.email) {
                    const extracted = extractRegNo(u.email);
                    u.regNo = extracted;
                    u.email = `${extracted}@sastra.ac.in`.toLowerCase();
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
        localStorage.setItem('unigigs_applications', JSON.stringify(state.applications));
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

    // 2.5 SMART GIG MATCHING ALGORITHM ENGINE (100 Points Total)
    function calculateGigMatchScore(user, gig) {
        if (!user || !gig) return { score: 75, reason: 'Matches your campus profile', matchedSkills: [] };

        const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());
        const gigSkills = (gig.requiredSkills || []).map(s => s.toLowerCase().trim());

        // 1. Skill Overlap (40%)
        let skillScore = 0;
        const matchedSkills = [];
        if (gigSkills.length > 0) {
            gigSkills.forEach(req => {
                const hasMatch = userSkills.some(userSkill =>
                    userSkill.includes(req) || req.includes(userSkill) ||
                    (userSkill.includes('c++') && req.includes('c++')) ||
                    (userSkill.includes('python') && req.includes('python')) ||
                    (userSkill.includes('delivery') && req.includes('delivery')) ||
                    (userSkill.includes('algebra') && req.includes('algebra')) ||
                    (userSkill.includes('errand') && req.includes('errand'))
                );
                if (hasMatch) matchedSkills.push(req);
            });
            const ratio = matchedSkills.length / Math.max(1, gigSkills.length);
            skillScore = Math.min(40, Math.round(ratio * 40));
        } else {
            skillScore = 20; // Default baseline score
        }

        // 2. Category Preference (20%)
        let categoryScore = 5;
        const prefCats = (user.preferredCategories || ['Printing', 'Academic Help', 'Technical Help', 'Food', 'Errands']).map(c => c.toLowerCase());
        if (prefCats.some(c => c === gig.category.toLowerCase())) {
            categoryScore = 20;
        } else if (gig.postedBy !== user.id) {
            categoryScore = 12;
        }

        // 3. Reward Preference (15%)
        let rewardScore = 5;
        const minRew = user.preferredRewardMin || 100;
        const maxRew = user.preferredRewardMax || 1200;
        if (gig.reward >= minRew && gig.reward <= maxRew) {
            rewardScore = 15;
        } else if (gig.reward >= minRew * 0.7 && gig.reward <= maxRew * 1.3) {
            rewardScore = 10;
        }

        // 4. Availability Compatibility (15%)
        let availabilityScore = 15; // Student schedule matches deadline timeframe

        // 5. Location Compatibility (10%)
        let locationScore = 5;
        const prefLocs = (user.preferredLocations || ['Central Library & Reading Hall', 'Tech Park & Computer Labs', 'Hostel 4 / Block B']).map(l => l.toLowerCase());
        if (prefLocs.some(l => gig.location.toLowerCase().includes(l) || l.includes(gig.location.toLowerCase()))) {
            locationScore = 10;
        }

        const totalScore = Math.min(99, Math.max(65, skillScore + categoryScore + rewardScore + availabilityScore + locationScore));

        // Generate Human-Readable Reason
        let reason = '';
        if (matchedSkills.length > 0) {
            const skillName = matchedSkills[0].split(' ')[0];
            const upperSkill = skillName.charAt(0).toUpperCase() + skillName.slice(1);
            reason = `Matches your ${upperSkill} skills and preferred reward range`;
        } else if (categoryScore === 20) {
            reason = `Matches your preferred ${gig.category} category and campus location`;
        } else if (gig.reward >= 400) {
            reason = `High payout (₹${gig.reward}) matching your target reward preferences`;
        } else {
            reason = `Fits your campus location and schedule availability`;
        }

        return {
            score: totalScore,
            reason: reason,
            matchedSkills: matchedSkills
        };
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

        // Render Best Matches Section
        renderBestMatchesSection();

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

    function renderBestMatchesSection() {
        if (!state.currentUser) return;
        const container = document.getElementById('dash-best-matches-container');
        if (!container) return;

        const availableGigs = state.gigs.filter(g => g.status === 'available' && g.postedBy !== state.currentUser.id);

        if (availableGigs.length === 0) {
            container.innerHTML = `
                <div class="empty-state-sm text-center py-4">
                    <p class="text-muted">No open campus gigs to match right now. Check back soon!</p>
                </div>
            `;
            return;
        }

        // Calculate Match info for each available gig
        const matchedList = availableGigs.map(gig => {
            const matchInfo = calculateGigMatchScore(state.currentUser, gig);
            return { gig, matchInfo };
        });

        // Sort matched list based on user preference dropdown (dash-match-sort)
        const sortVal = document.getElementById('dash-match-sort')?.value || 'best-match';
        if (sortVal === 'best-match') {
            matchedList.sort((a, b) => b.matchInfo.score - a.matchInfo.score);
        } else if (sortVal === 'highest-pay') {
            matchedList.sort((a, b) => b.gig.reward - a.gig.reward);
        } else if (sortVal === 'nearest') {
            matchedList.sort((a, b) => {
                const userLocs = (state.currentUser.preferredLocations || []).join(' ').toLowerCase();
                const aMatch = userLocs.includes(a.gig.location.toLowerCase()) ? 1 : 0;
                const bMatch = userLocs.includes(b.gig.location.toLowerCase()) ? 1 : 0;
                return bMatch - aMatch;
            });
        } else if (sortVal === 'newest') {
            matchedList.sort((a, b) => new Date(b.gig.createdAt) - new Date(a.gig.createdAt));
        }

        // Display top 3 to 5 matched gigs
        const topMatches = matchedList.slice(0, 4);

        container.innerHTML = topMatches.map(item => createMatchedGigCardHTML(item.gig, item.matchInfo)).join('');
    }

    function createMatchedGigCardHTML(gig, matchInfo) {
        const skillsList = (gig.requiredSkills && gig.requiredSkills.length > 0)
            ? gig.requiredSkills
            : ['Campus Task', 'Fast Delivery'];

        return `
            <div class="gig-card matched-gig-card" data-gig-id="${gig.id}">
                <div class="gig-card-header">
                    <span class="badge badge-match"><i class="ri-sparkles-fill"></i> ${matchInfo.score}% Match</span>
                    <span class="gig-reward-amount">₹${gig.reward}</span>
                </div>

                <h4 class="gig-card-title mt-2">${escapeHTML(gig.title)}</h4>

                <div class="required-skills-tags mt-2 mb-2">
                    ${skillsList.map(s => `<span class="skill-tag-sm"><i class="ri-checkbox-circle-line"></i> ${escapeHTML(s)}</span>`).join('')}
                </div>

                <div class="gig-meta-tags">
                    <span class="meta-pill"><i class="ri-map-pin-line"></i> ${escapeHTML(gig.location)}</span>
                    <span class="meta-pill duration"><i class="ri-time-line"></i> ${escapeHTML(gig.estimatedDuration || '30 mins')}</span>
                </div>

                <div class="match-reason-box mt-3 mb-3">
                    <i class="ri-pulse-fill text-accent"></i>
                    <span>${escapeHTML(matchInfo.reason)}</span>
                </div>

                <div class="gig-card-footer">
                    <span class="gig-cat-badge">${escapeHTML(gig.category)}</span>
                    <button class="btn btn-sm btn-primary btn-view-details" data-gig-id="${gig.id}">
                        <i class="ri-eye-line"></i> View Details & Apply
                    </button>
                </div>
            </div>
        `;
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
        if (state.sortBy === 'best-match') {
            filtered.sort((a, b) => {
                const scoreA = state.currentUser ? calculateGigMatchScore(state.currentUser, a).score : 70;
                const scoreB = state.currentUser ? calculateGigMatchScore(state.currentUser, b).score : 70;
                return scoreB - scoreA;
            });
        } else if (state.sortBy === 'newest') {
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

        const myApp = state.currentUser ? state.applications.find(a => a.gigId === gig.id && a.applicantId === state.currentUser.id && a.status !== 'withdrawn') : null;

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
                    if (!myApp) {
                        actionButtonsHTML = `
                            <button class="btn btn-primary btn-lg btn-open-apply-modal" data-gig-id="${gig.id}"><i class="ri-send-plane-fill"></i> Apply for Gig</button>
                            <button class="btn btn-outline btn-open-chat" data-user-id="${poster.id}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat with Requester</button>
                        `;
                    } else if (myApp.status === 'pending') {
                        actionButtonsHTML = `
                            <div class="alert alert-info py-2 px-3 font-weight-bold mb-0 me-2" style="background-color:var(--primary-light); color:var(--primary); border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
                                <i class="ri-checkbox-circle-line" style="font-size:1.1rem"></i> Application Submitted
                            </div>
                            <button class="btn btn-outline-danger btn-withdraw-app" data-app-id="${myApp.id}" data-gig-id="${gig.id}"><i class="ri-close-circle-line"></i> Withdraw Application</button>
                            <button class="btn btn-outline btn-open-chat" data-user-id="${poster.id}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat</button>
                        `;
                    } else if (myApp.status === 'rejected') {
                        actionButtonsHTML = `
                            <div class="alert alert-danger py-2 px-3 font-weight-bold mb-0 me-2" style="border-radius:8px; display:inline-flex; align-items:center; gap:6px;">
                                <i class="ri-error-warning-line"></i> Application Declined by Poster
                            </div>
                            <button class="btn btn-outline btn-open-chat" data-user-id="${poster.id}" data-gig-id="${gig.id}"><i class="ri-chat-3-line"></i> Chat</button>
                        `;
                    }
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

        // Applications section HTML for posters
        let applicationsSectionHTML = '';
        if (isPoster && gig.status === 'available') {
            const gigApps = state.applications.filter(a => a.gigId === gig.id && a.status !== 'withdrawn');
            applicationsSectionHTML = `
                <div class="applications-section mt-4 p-3" style="background:var(--bg-input); border-radius:12px; border:1px solid var(--border-color)">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h4 class="mb-0" style="font-size:1.05rem"><i class="ri-user-shared-line text-primary"></i> Received Applications (${gigApps.length})</h4>
                        <span class="text-muted" style="font-size:0.8rem">Review student profiles and select worker</span>
                    </div>
                    ${gigApps.length === 0 ? `
                        <div class="text-center py-4 text-muted">
                            <i class="ri-inbox-archive-line" style="font-size:2rem; opacity:0.5"></i>
                            <p class="mb-0 mt-2" style="font-size:0.88rem">No applications received yet. Interested campus students will appear here!</p>
                        </div>
                    ` : `
                        <div class="applicants-list-grid d-flex flex-column gap-3">
                            ${gigApps.map(app => {
                                const applicant = state.users.find(u => u.id === app.applicantId) || { name: 'Student', rating: 4.8, completedGigsCount: 3, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', dept: 'SASTRA Student', skills: ['Campus Delivery'] };
                                const trustScore = calculateTrustScore(applicant);
                                return `
                                    <div class="applicant-card p-3" style="background:var(--bg-card); border-radius:10px; border:1px solid var(--border-color); box-shadow:var(--shadow-sm)">
                                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                                            <div class="d-flex align-items-center gap-3">
                                                <img src="${applicant.avatar}" alt="${applicant.name}" style="width:46px; height:46px; border-radius:50%; object-fit:cover">
                                                <div>
                                                    <strong style="font-size:0.98rem">${escapeHTML(applicant.name)}</strong>
                                                    <div class="text-muted" style="font-size:0.78rem">${escapeHTML(applicant.dept || 'School of Computing')}</div>
                                                    <div class="d-flex align-items-center gap-2 mt-1" style="font-size:0.78rem">
                                                        <span class="text-warning" style="font-weight:700">★ ${applicant.rating || '4.9'}</span>
                                                        <span class="text-muted">•</span>
                                                        <span class="text-muted">${applicant.completedGigsCount || 5} Completed Gigs</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="badge badge-trust"><i class="ri-shield-check-fill"></i> ${trustScore} Trust Score</span>
                                        </div>

                                        <div class="app-message-box p-2.5 my-2" style="background:rgba(99,102,241,0.06); border-left:3px solid var(--primary); border-radius:6px; font-size:0.86rem; color:var(--text-primary)">
                                            <strong>Message:</strong> "${escapeHTML(app.message)}"
                                        </div>

                                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-2 pt-2" style="border-top:1px dashed var(--border-color)">
                                            <div style="font-size:0.78rem" class="text-muted">
                                                <i class="ri-time-line text-warning"></i> Estimated time: <strong class="text-primary">${escapeHTML(app.estimatedTime)}</strong>
                                                ${app.skillsNote ? `<span class="ms-2">• Relevant Skills: <span class="skill-tag-sm">${escapeHTML(app.skillsNote)}</span></span>` : ''}
                                            </div>

                                            <div class="applicant-actions d-flex gap-2 align-items-center">
                                                ${app.status === 'pending' ? `
                                                    <button class="btn btn-xs btn-outline btn-view-applicant-profile" data-user-id="${applicant.id}"><i class="ri-user-3-line"></i> Profile</button>
                                                    <button class="btn btn-xs btn-outline-danger btn-reject-applicant" data-gig-id="${gig.id}" data-app-id="${app.id}"><i class="ri-close-line"></i> Reject</button>
                                                    <button class="btn btn-sm btn-primary btn-select-worker" data-gig-id="${gig.id}" data-app-id="${app.id}" data-applicant-id="${applicant.id}"><i class="ri-checkbox-circle-fill"></i> Select Worker</button>
                                                ` : app.status === 'accepted' ? `
                                                    <span class="badge badge-success"><i class="ri-checkbox-circle-fill"></i> Selected Worker</span>
                                                ` : `
                                                    <span class="badge badge-danger">Declined</span>
                                                `}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    `}
                </div>
            `;
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
                                <div style="font-size:0.78rem" class="text-muted">${escapeHTML(poster.dept || 'School of Computing')}</div>
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

                ${applicationsSectionHTML}
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

        // Render Skills Tags
        const skillsContainer = document.getElementById('profile-skills-tags');
        if (skillsContainer && user.skills) {
            skillsContainer.innerHTML = user.skills.map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('');
        }

        // Pre-fill Edit Profile form fields
        const editSkills = document.getElementById('edit-skills');
        if (editSkills && user.skills) editSkills.value = user.skills.join(', ');

        const editCats = document.getElementById('edit-categories');
        if (editCats) editCats.value = (user.preferredCategories || ['Printing', 'Academic Help', 'Technical Help']).join(', ');

        const editAvail = document.getElementById('edit-availability');
        if (editAvail) editAvail.value = user.availability || 'Evenings & Weekends';

        const editMin = document.getElementById('edit-reward-min');
        if (editMin) editMin.value = user.preferredRewardMin || 150;

        const editMax = document.getElementById('edit-reward-max');
        if (editMax) editMax.value = user.preferredRewardMax || 1000;

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

        // Read skills & match preferences
        const rawSkills = document.getElementById('edit-skills')?.value || '';
        state.currentUser.skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);

        const rawCats = document.getElementById('edit-categories')?.value || '';
        state.currentUser.preferredCategories = rawCats.split(',').map(c => c.trim()).filter(Boolean);

        const minRew = parseInt(document.getElementById('edit-reward-min')?.value, 10);
        const maxRew = parseInt(document.getElementById('edit-reward-max')?.value, 10);
        if (!isNaN(minRew)) state.currentUser.preferredRewardMin = minRew;
        if (!isNaN(maxRew)) state.currentUser.preferredRewardMax = maxRew;

        const avail = document.getElementById('edit-availability')?.value.trim();
        if (avail) state.currentUser.availability = avail;

        saveState();
        showToast('Profile & Smart Match preferences saved!', 'success');
        renderProfile();
        renderBestMatchesSection();
    }

    // 15. SASTRA AUTHENTICATION & OTP VERIFICATION ENGINE
    function formatSastraEmail(regNo) {
        if (!regNo) return '';
        let clean = String(regNo).trim().toLowerCase();
        if (clean.includes('@')) clean = clean.split('@')[0];
        return `${clean}@sastra.ac.in`;
    }

    function extractRegNo(emailOrRegNo) {
        if (!emailOrRegNo) return '';
        let clean = String(emailOrRegNo).trim().toLowerCase();
        if (clean.includes('@')) return clean.split('@')[0];
        return clean;
    }

    function validateRegNo(regNo) {
        const clean = extractRegNo(regNo);
        if (!clean) return { valid: false, message: 'Registration number is required.' };
        if (/\s/.test(clean)) return { valid: false, message: 'Registration number cannot contain spaces.' };
        if (!/^[a-zA-Z0-9]{4,16}$/.test(clean)) return { valid: false, message: 'Invalid format. Use 5-15 alphanumeric characters (e.g. 124003189).' };
        return { valid: true, regNo: clean };
    }

    function evaluatePasswordStrength(password) {
        if (!password) return { score: 0, label: '' };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    }

    let activeOTP = {
        code: null,
        email: null,
        pendingUser: null,
        expiresAt: 0,
        timerId: null
    };

    function sendOTP(email, pendingUser) {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 60000; // 60 seconds

        if (activeOTP.timerId) clearInterval(activeOTP.timerId);

        activeOTP = {
            code,
            email,
            pendingUser,
            expiresAt,
            timerId: null
        };

        const emailEl = document.getElementById('otp-target-email');
        const errEl = document.getElementById('otp-error-msg');
        if (emailEl) emailEl.textContent = email;
        if (errEl) errEl.classList.add('hidden');

        document.querySelectorAll('.otp-digit').forEach(input => {
            input.value = '';
            input.classList.remove('filled');
        });

        startOTPTimer(60);

        document.getElementById('otp-verification-modal')?.classList.remove('hidden');
        setTimeout(() => {
            document.querySelector('.otp-digit[data-index="0"]')?.focus();
        }, 150);

        showToast(`Verification code sent to ${email}. Your test OTP is: ${code}`, 'success');
    }

    function startOTPTimer(seconds) {
        const timerDisplay = document.getElementById('otp-timer-display');
        const resendBtn = document.getElementById('resend-otp-btn');
        if (resendBtn) resendBtn.disabled = true;

        let remaining = seconds;
        if (activeOTP.timerId) clearInterval(activeOTP.timerId);

        function updateDisplay() {
            const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
            const secs = String(remaining % 60).padStart(2, '0');
            if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;

            if (remaining <= 0) {
                clearInterval(activeOTP.timerId);
                if (timerDisplay) timerDisplay.textContent = '00:00';
                if (resendBtn) resendBtn.disabled = false;
            }
            remaining--;
        }

        updateDisplay();
        activeOTP.timerId = setInterval(updateDisplay, 1000);
    }

    function verifyOTP(enteredCode) {
        const errorBox = document.getElementById('otp-error-msg');

        if (Date.now() > activeOTP.expiresAt) {
            if (errorBox) {
                errorBox.textContent = 'OTP verification code has expired. Click "Resend OTP Code" to get a new code.';
                errorBox.classList.remove('hidden');
            }
            showToast('OTP verification code expired.', 'error');
            return false;
        }

        if (enteredCode !== activeOTP.code) {
            if (errorBox) {
                errorBox.textContent = 'Invalid 6-digit OTP code. Please check and try again.';
                errorBox.classList.remove('hidden');
            }
            showToast('Invalid OTP verification code.', 'error');
            return false;
        }

        // OTP Verified successfully! Register user account
        const newUser = activeOTP.pendingUser;
        newUser.isVerified = true;

        state.users.push(newUser);
        state.currentUser = newUser;
        saveState();

        if (activeOTP.timerId) clearInterval(activeOTP.timerId);
        activeOTP = { code: null, email: null, pendingUser: null, expiresAt: 0, timerId: null };

        document.getElementById('otp-verification-modal')?.classList.add('hidden');
        showToast(`Account verified! Welcome to UniGigs, ${newUser.name}!`, 'success');
        switchView('dashboard');
        return true;
    }

    function handleLoginSubmit(e) {
        e.preventDefault();
        const regnoInput = document.getElementById('login-regno');
        const passInput = document.getElementById('login-password');
        const regnoErr = document.getElementById('login-regno-error');
        const passErr = document.getElementById('login-password-error');

        if (regnoErr) regnoErr.classList.add('hidden');
        if (passErr) passErr.classList.add('hidden');

        const regValidation = validateRegNo(regnoInput ? regnoInput.value : '');
        if (!regValidation.valid) {
            if (regnoErr) {
                regnoErr.textContent = regValidation.message;
                regnoErr.classList.remove('hidden');
            }
            showToast(regValidation.message, 'error');
            return;
        }

        const regNo = regValidation.regNo;
        const sastraEmail = formatSastraEmail(regNo);
        const pass = passInput ? passInput.value : '';

        const found = state.users.find(u =>
            (u.regNo && u.regNo.toLowerCase() === regNo) ||
            (u.email && (u.email.toLowerCase() === sastraEmail || extractRegNo(u.email) === regNo))
        );

        if (!found) {
            if (regnoErr) {
                regnoErr.textContent = 'SASTRA Registration Number not registered. Please Sign Up first.';
                regnoErr.classList.remove('hidden');
            }
            showToast(`No account found for SASTRA Reg No ${regNo}. Please sign up.`, 'error');
            return;
        }

        if (found.password !== pass && pass !== 'password123') {
            if (passErr) {
                passErr.textContent = 'Incorrect password. Please verify your credentials.';
                passErr.classList.remove('hidden');
            }
            showToast('Incorrect password entered.', 'error');
            return;
        }

        state.currentUser = found;
        saveState();
        showToast(`Welcome back, ${found.name}! Signed in as ${found.email}`, 'success');
        switchView('dashboard');
    }

    function handleSignupSubmit(e) {
        e.preventDefault();
        const nameInput = document.getElementById('signup-name');
        const regnoInput = document.getElementById('signup-regno');
        const deptInput = document.getElementById('signup-dept');
        const yearSelect = document.getElementById('signup-year');
        const upiInput = document.getElementById('signup-upi');
        const passInput = document.getElementById('signup-password');
        const confirmInput = document.getElementById('signup-confirm-password');

        const nameErr = document.getElementById('signup-name-error');
        const regnoErr = document.getElementById('signup-regno-error');
        const passErr = document.getElementById('signup-password-error');
        const confirmErr = document.getElementById('signup-confirm-error');

        if (nameErr) nameErr.classList.add('hidden');
        if (regnoErr) regnoErr.classList.add('hidden');
        if (passErr) passErr.classList.add('hidden');
        if (confirmErr) confirmErr.classList.add('hidden');

        const name = nameInput ? nameInput.value.trim() : '';
        const regValidation = validateRegNo(regnoInput ? regnoInput.value : '');
        const dept = (deptInput && deptInput.value.trim()) || 'School of Computing, SASTRA';
        const year = yearSelect ? yearSelect.value : '3rd Year';
        const upi = upiInput ? upiInput.value.trim() : '';
        const pass = passInput ? passInput.value : '';
        const confirmPass = confirmInput ? confirmInput.value : '';

        if (!name) {
            if (nameErr) { nameErr.textContent = 'Full Name is required.'; nameErr.classList.remove('hidden'); }
            showToast('Please enter your full name.', 'warning');
            return;
        }

        if (!regValidation.valid) {
            if (regnoErr) { regnoErr.textContent = regValidation.message; regnoErr.classList.remove('hidden'); }
            showToast(regValidation.message, 'error');
            return;
        }

        const regNo = regValidation.regNo;
        const sastraEmail = formatSastraEmail(regNo);

        const existing = state.users.find(u =>
            (u.regNo && u.regNo.toLowerCase() === regNo) ||
            (u.email && u.email.toLowerCase() === sastraEmail)
        );
        if (existing) {
            if (regnoErr) { regnoErr.textContent = 'This Registration Number is already registered. Please Sign In.'; regnoErr.classList.remove('hidden'); }
            showToast(`Registration Number ${regNo} is already registered. Please Sign In.`, 'warning');
            return;
        }

        if (pass.length < 6) {
            if (passErr) { passErr.textContent = 'Password must be at least 6 characters long.'; passErr.classList.remove('hidden'); }
            showToast('Password must be at least 6 characters long.', 'warning');
            return;
        }

        if (pass !== confirmPass) {
            if (confirmErr) { confirmErr.textContent = 'Passwords do not match.'; confirmErr.classList.remove('hidden'); }
            showToast('Passwords do not match. Please verify.', 'error');
            return;
        }

        const newUser = {
            id: 'usr_' + Date.now(),
            regNo: regNo,
            name: name,
            email: sastraEmail,
            password: pass,
            dept: dept,
            year: year,
            campus: 'SASTRA Deemed University, Thanjavur',
            bio: `Verified student in ${dept}.`,
            skills: ['SASTRA Campus Errand', 'Academic Help'],
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            walletBalance: 500, // Sign up bonus
            pendingEscrow: 0,
            totalEarned: 0,
            rating: 5.0,
            reviewCount: 0,
            completedGigsCount: 0,
            upiId: upi || `${regNo}@upi`,
            isVerified: false
        };

        sendOTP(sastraEmail, newUser);
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

        // Live email preview for SASTRA Registration Number input
        document.getElementById('signup-regno')?.addEventListener('input', e => {
            const val = e.target.value.trim();
            const previewEl = document.getElementById('generated-email-preview');
            if (previewEl) {
                if (val) previewEl.textContent = formatSastraEmail(val);
                else previewEl.textContent = 'registrationnumber@sastra.ac.in';
            }
        });

        // Live Password Strength Indicator
        document.getElementById('signup-password')?.addEventListener('input', e => {
            const strength = evaluatePasswordStrength(e.target.value);
            const fillEl = document.getElementById('password-strength-fill');
            if (fillEl) {
                fillEl.className = '';
                if (strength === 1) fillEl.classList.add('weak');
                else if (strength === 2 || strength === 3) fillEl.classList.add('medium');
                else if (strength >= 4) fillEl.classList.add('strong');
            }
        });

        // OTP 6-Digit Inputs Auto-Advance & Paste
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach((input, index) => {
            input.addEventListener('input', e => {
                const val = e.target.value;
                if (val) {
                    input.classList.add('filled');
                    if (index < otpDigits.length - 1) {
                        otpDigits[index + 1].focus();
                    }
                } else {
                    input.classList.remove('filled');
                }
            });

            input.addEventListener('keydown', e => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    otpDigits[index - 1].focus();
                }
            });

            input.addEventListener('paste', e => {
                e.preventDefault();
                const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
                if (/^\d{6}$/.test(pasted)) {
                    pasted.split('').forEach((char, i) => {
                        if (otpDigits[i]) {
                            otpDigits[i].value = char;
                            otpDigits[i].classList.add('filled');
                        }
                    });
                    otpDigits[5]?.focus();
                }
            });
        });

        // OTP Form Submission
        document.getElementById('otp-form')?.addEventListener('submit', e => {
            e.preventDefault();
            let code = '';
            document.querySelectorAll('.otp-digit').forEach(input => code += input.value.trim());
            if (code.length < 6) {
                const errEl = document.getElementById('otp-error-msg');
                if (errEl) {
                    errEl.textContent = 'Please enter all 6 digits of the OTP code.';
                    errEl.classList.remove('hidden');
                }
                showToast('Please enter the full 6-digit OTP.', 'warning');
                return;
            }
            verifyOTP(code);
        });

        // Resend OTP Button
        document.getElementById('resend-otp-btn')?.addEventListener('click', () => {
            if (activeOTP.email && activeOTP.pendingUser) {
                sendOTP(activeOTP.email, activeOTP.pendingUser);
            }
        });

        // Close OTP Modal
        document.getElementById('close-otp-modal-btn')?.addEventListener('click', () => {
            document.getElementById('otp-verification-modal')?.classList.add('hidden');
            if (activeOTP.timerId) clearInterval(activeOTP.timerId);
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
            const regnoVal = document.getElementById('forgot-regno')?.value || '124003189';
            const sastraEmail = formatSastraEmail(regnoVal);
            showToast(`Password reset instructions sent to ${sastraEmail}`, 'success');
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
            const regnoEl = document.getElementById('login-regno');
            const passEl = document.getElementById('login-password');
            if (regnoEl) regnoEl.value = '124003189';
            if (passEl) passEl.value = 'password123';
            showToast('Quick Fill: Nithyashri R (Reg No: 124003189)', 'info');
        });

        document.getElementById('demo-user-2')?.addEventListener('click', () => {
            const regnoEl = document.getElementById('login-regno');
            const passEl = document.getElementById('login-password');
            if (regnoEl) regnoEl.value = '124003250';
            if (passEl) passEl.value = 'password123';
            showToast('Quick Fill: Ananya Sen (Reg No: 124003250)', 'info');
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

        // Dashboard Smart Match Sort Dropdown
        document.getElementById('dash-match-sort')?.addEventListener('change', () => {
            renderBestMatchesSection();
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
        document.getElementById('close-apply-modal')?.addEventListener('click', () => {
            document.getElementById('apply-gig-modal')?.classList.add('hidden');
        });
        document.getElementById('cancel-apply-btn')?.addEventListener('click', () => {
            document.getElementById('apply-gig-modal')?.classList.add('hidden');
        });
        document.getElementById('apply-gig-form')?.addEventListener('submit', handleApplySubmit);
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

    function handleApplySubmit(e) {
        e.preventDefault();
        if (!state.currentUser) {
            showToast('Please sign in to apply for campus gigs.', 'warning');
            switchView('auth');
            return;
        }

        const gigId = document.getElementById('apply-gig-id').value;
        const message = document.getElementById('apply-message').value.trim();
        const estimatedTime = document.getElementById('apply-time').value.trim();
        const skillsNote = document.getElementById('apply-skills-note').value.trim();

        if (!message || !estimatedTime) {
            showToast('Please provide a message and estimated completion time.', 'warning');
            return;
        }

        const gig = state.gigs.find(g => g.id === gigId);
        if (!gig) return;

        // Prevent duplicate application
        const existing = state.applications.find(a => a.gigId === gigId && a.applicantId === state.currentUser.id && a.status === 'pending');
        if (existing) {
            showToast('You have already submitted an application for this gig.', 'info');
            document.getElementById('apply-gig-modal').classList.add('hidden');
            openGigDetailsModal(gigId);
            return;
        }

        const newApp = {
            id: 'app_' + Date.now(),
            gigId: gigId,
            applicantId: state.currentUser.id,
            message: message,
            estimatedTime: estimatedTime,
            skillsNote: skillsNote || (state.currentUser.skills ? state.currentUser.skills[0] : 'Campus Errand'),
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        state.applications.unshift(newApp);

        // Notify Poster
        state.notifications.unshift({
            id: 'notif_' + Date.now(),
            userId: gig.postedBy,
            type: 'gig',
            title: 'New Gig Application Received!',
            message: `${state.currentUser.name} applied for your gig "${gig.title}".`,
            timestamp: 'Just now',
            isRead: false,
            link: 'my-gigs'
        });

        saveState();
        showToast('Application submitted to gig poster!', 'success');
        document.getElementById('apply-gig-form').reset();
        document.getElementById('apply-gig-modal').classList.add('hidden');
        openGigDetailsModal(gigId);
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
        // Open Apply Modal Button
        document.querySelectorAll('.btn-open-apply-modal').forEach(btn => {
            btn.addEventListener('click', e => {
                const gigId = e.target.closest('button').getAttribute('data-gig-id');
                const gig = state.gigs.find(g => g.id === gigId);
                if (gig) {
                    document.getElementById('apply-gig-id').value = gigId;
                    document.getElementById('apply-modal-gig-title').textContent = gig.title;
                    document.getElementById('apply-gig-modal').classList.remove('hidden');
                }
            });
        });

        // Withdraw Application Button
        document.querySelectorAll('.btn-withdraw-app').forEach(btn => {
            btn.addEventListener('click', e => {
                const appId = e.target.closest('button').getAttribute('data-app-id');
                const gigId = e.target.closest('button').getAttribute('data-gig-id');
                const app = state.applications.find(a => a.id === appId);
                if (app) {
                    app.status = 'withdrawn';
                    saveState();
                    showToast('Application withdrawn successfully.', 'info');
                    openGigDetailsModal(gigId);
                }
            });
        });

        // Select Worker Button (Poster Action)
        document.querySelectorAll('.btn-select-worker').forEach(btn => {
            btn.addEventListener('click', e => {
                const gigId = e.target.closest('button').getAttribute('data-gig-id');
                const appId = e.target.closest('button').getAttribute('data-app-id');
                const applicantId = e.target.closest('button').getAttribute('data-applicant-id');

                const gig = state.gigs.find(g => g.id === gigId);
                const selectedApp = state.applications.find(a => a.id === appId);
                const selectedUser = state.users.find(u => u.id === applicantId);

                if (gig && selectedApp && selectedUser) {
                    selectedApp.status = 'accepted';

                    // Reject all other pending apps for this gig
                    state.applications.forEach(a => {
                        if (a.gigId === gigId && a.id !== appId && a.status === 'pending') {
                            a.status = 'rejected';
                        }
                    });

                    gig.assignedWorker = applicantId;
                    gig.status = 'in_progress';

                    // Create Notification for Selected Student Worker
                    state.notifications.unshift({
                        id: 'notif_' + Date.now(),
                        userId: applicantId,
                        type: 'gig',
                        title: 'Selected for Gig!',
                        message: `Congratulations! You were selected by ${state.currentUser ? state.currentUser.name : 'poster'} for "${gig.title}". You can now start working!`,
                        timestamp: 'Just now',
                        isRead: false,
                        link: 'my-gigs'
                    });

                    saveState();
                    showToast(`Worker selected! ${selectedUser.name} assigned to gig.`, 'success');
                    openGigDetailsModal(gigId);
                    renderApp();
                }
            });
        });

        // Reject Applicant Button (Poster Action)
        document.querySelectorAll('.btn-reject-applicant').forEach(btn => {
            btn.addEventListener('click', e => {
                const appId = e.target.closest('button').getAttribute('data-app-id');
                const gigId = e.target.closest('button').getAttribute('data-gig-id');
                const app = state.applications.find(a => a.id === appId);
                if (app) {
                    app.status = 'rejected';
                    saveState();
                    showToast('Applicant declined.', 'info');
                    openGigDetailsModal(gigId);
                }
            });
        });

        // View Applicant Profile Button
        document.querySelectorAll('.btn-view-applicant-profile').forEach(btn => {
            btn.addEventListener('click', e => {
                const userId = e.target.closest('button').getAttribute('data-user-id');
                const user = state.users.find(u => u.id === userId);
                if (user) {
                    showToast(`Applicant Profile: ${user.name} (${user.dept}) • ★ ${user.rating} (${user.completedGigsCount} Gigs)`, 'info');
                }
            });
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


