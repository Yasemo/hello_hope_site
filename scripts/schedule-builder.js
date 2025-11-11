// Schedule Builder with Smart Validation
document.addEventListener('DOMContentLoaded', function() {
    // Program data with audience compatibility (enhanced with detailed information)
    const programsData = {
        'hello-hope': {
            id: 'hello-hope',
            name: 'HELLO HOPE',
            tagline: 'Battling Loneliness & The Other Things That Can Weigh Us Down',
            description: 'Practical tools for building real human bonds that actually stick.',
            focus: 'This student session focuses on bringing encouragement and relief to participants to tackle stress and anxiety during and after a pandemic. Learning components include the connection between social media, empathy and the health benefits of face to face interaction, and practical take-aways on how to create stronger bonds with others.',
            materials: 'Students will receive practical handouts with strategies for managing stress, building authentic connections, and creating healthier relationships with technology and peers.',
            versions: ['Gr. 4-6', 'Gr. 7-8', 'Gr. 9-10', 'Gr. 11-12', 'Faculty', 'Sr. Admin.', 'Parents/Guardians', 'Corporate', 'Teams'],
            duration: '60 min',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity.',
            hasParts: false
        },
        'colour-blind': {
            id: 'colour-blind',
            name: 'COLOUR BLIND?',
            tagline: 'Why Being "Not Racist" Is Not Enough',
            description: 'Part 1 explores why this fight is a matter of the heart. Part 2 delivers actionable steps.',
            focus: 'PART 1 for Students focuses on why this issue is even worth our time and why it needs to be a matter of the heart before change can occur. The three objectives are: (1) To explain what racism is and isn\'t once and for all, (2) to help us see how it connects to us here and now, and (3) to inspire us to be the opposite of racist for the long haul. PART 2 focuses on practical ways we can interrupt racism and create a sweeter, safer, stronger school community.',
            focusAdult: 'The adult versions have three objectives: (1) to remind you that it is not just "ok" but it is crucial that we come together and have a million of these conversations, (2) to help you identify where you are at on this journey of awareness and combating racism, and (3) to inspire you to be the opposite for the long haul (regardless of how old you are). Part 2 for adults helps us identify where we go from here with actionable steps and guiding principles for your anti-racism practice.',
            materials: 'Grade 7-12 students receive a handout entitled "Stuff to Pack and Steps to Take for Your Anti-Racism Journey" with age-appropriate book titles, articles, and videos. Primary students receive a printable colour poster with the "Three Truths" about skin colour and a working definition of racism in kid-friendly language.',
            versions: ['K-3', 'Gr. 4-6', 'Gr. 7-8', 'Gr. 9-10', 'Gr. 11-12', 'Faculty', 'Sr. Admin.', 'Parents/Guardians', 'Corporate', 'Teams'],
            duration: '60 min each',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity. Global citizenship and communities, local communities (social studies), Canada a changing society.',
            hasParts: true
        },
        'stick-truth': {
            id: 'stick-truth',
            name: 'STICK WITH THE TRUTH',
            tagline: 'Three Truths About Skin Colour',
            description: 'Age-appropriate way to stick with truths about skin colour.',
            focus: 'The Primary Presentation focuses on the three truths about skin colour and on equipping students in an age-appropriate way to stick with those truths so as not to believe any lies about skin colour which cause harm. PART 2 (for Gr. 4-6) focuses on practical ways we can interrupt racism and create a sweeter, safer, stronger school community in an age appropriate way.',
            materials: 'Primary and junior students will receive a printable colour poster with the "Three Truths" about skin colour, and a working definition of racism in kid-friendly language.',
            versions: ['K-3', 'Gr. 4-6'],
            duration: '60 min each',
            curriculum: 'Global citizenship and communities, local communities (social studies), Canada a changing society.',
            hasParts: false
        },
        'just-here': {
            id: 'just-here',
            name: 'I\'M JUST HERE',
            tagline: 'What Am I Doing? What\'s The Point?',
            description: 'Raw talk on self-identity, peer conflicts, and the secret to supreme satisfaction.',
            focus: '"I\'m just here." Some of us don\'t have a clue what we are doing, what the point is, or where we can go from here. Many of us are existing but not really living as we feel a sense of purposelessness. This raw, sincere, and encouraging talk tackles peer-conflicts and motivation for the future by going upstream to look at self-identity, purpose, and the "secret to supreme satisfaction".',
            materials: 'Students receive guidance materials focused on self-discovery, purpose-finding exercises, and practical strategies for navigating peer relationships and future planning.',
            versions: ['Gr. 7-8', 'Gr. 9-10', 'Gr. 11-12', 'Camps', 'Teams'],
            duration: '60 min',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity.',
            hasParts: false
        },
        'man-up': {
            id: 'man-up',
            name: 'MAN UP',
            tagline: 'Being A "Real Man" In Unreal Times',
            description: 'Straight conversation about male influence on culture and practical tools for using it for good.',
            focus: 'A no-joke conversation about the reality of the male influence on culture, the opportunity to use that influence for good, and practical tools to do it solo or with a squad.',
            materials: 'Grade 7-12 students will receive a handout entitled "Man Up - Cheat Sheet" which has age-appropriate words of affirmations for young boys to encourage themselves with as well as a couple of tips from the presentation to implement in their own interpersonal relationships.',
            versions: ['Gr. 6-8', 'Gr. 9-10', 'Gr. 11-12'],
            duration: '60 min',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity.',
            hasParts: false
        },
        'reconnect': {
            id: 'reconnect',
            name: 'RECONNECT',
            tagline: 'Finding Purpose In The Exhaustion',
            description: 'Help your team reconnect to what matters and reach the finish line.',
            focus: 'A focused session designed specifically for educators and administrators who are experiencing burnout and compassion fatigue. This presentation provides practical strategies for managing stress, reconnecting with purpose, and building resilience within educational teams.',
            materials: 'Educators receive self-care resources, burnout prevention strategies, and team-building exercises to implement in their schools.',
            versions: ['Educators', 'Administration', 'Special Teams'],
            duration: '60 min',
            curriculum: 'Professional development, wellness, team building, leadership development.',
            hasParts: false
        }
    };

    // Active schedule state
    let activeSchedule = [];

    // Version selection modal state
    let versionSelectionModal = null;
    let currentProgramForSelection = null;

    // Pricing data
    const pricingData = {
        elementary: {
            virtual: [775, 1280, 1835, 2390],
            inPerson: [985, 1830, 2725, 3590]
        },
        secondary: {
            virtual: [875, 1650, 2405, 3180],
            inPerson: [1185, 2220, 3335, 4420]
        }
    };

    const HST_RATE = 0.13;

    // Categorize audience for pricing
    function categorizeAudience(version) {
        // Elementary: K-8
        if (version.includes('K-3') || version.includes('Gr. 4-6') || 
            version.includes('Gr. 6-8') || version.includes('Gr. 7-8')) {
            return 'elementary';
        }
        // Secondary: 9-12
        if (version.includes('Gr. 9-10') || version.includes('Gr. 11-12')) {
            return 'secondary';
        }
        // Custom pricing for faculty, corporate, etc.
        return 'custom';
    }

    // Calculate cost for a single program
    function calculateProgramCost(audience, sessions, deliveryMethod) {
        if (audience === 'custom') {
            return null; // Custom pricing
        }

        const prices = pricingData[audience][deliveryMethod];
        
        // If sessions > 4, extrapolate beyond the pricing table
        if (sessions <= 4) {
            return prices[sessions - 1];
        } else {
            // Calculate average price per additional session beyond 4
            const baseFour = prices[3];
            const avgIncrease = (prices[3] - prices[0]) / 3;
            return baseFour + (avgIncrease * (sessions - 4));
        }
    }

    // Calculate discount percentage based on selections
    function calculateDiscount() {
        let totalVersions = 0;
        let totalPrograms = activeSchedule.length;

        activeSchedule.forEach(item => {
            totalVersions += item.selectedVersions.length;
        });

        // Multi-version discount (same program, multiple versions)
        let multiVersionDiscount = 0;
        activeSchedule.forEach(item => {
            if (item.selectedVersions.length >= 2) {
                // 10% discount for 2 versions, 15% for 3+, 20% for 4+
                if (item.selectedVersions.length >= 4) {
                    multiVersionDiscount += 20;
                } else if (item.selectedVersions.length >= 3) {
                    multiVersionDiscount += 15;
                } else {
                    multiVersionDiscount += 10;
                }
            }
        });

        // Multi-program discount
        let multiProgramDiscount = 0;
        if (totalPrograms >= 3) {
            multiProgramDiscount = 15; // 15% off for 3+ programs
        } else if (totalPrograms >= 2) {
            multiProgramDiscount = 10; // 10% off for 2 programs
        }

        // Combine discounts (don't exceed 25% total)
        const totalDiscountPercent = Math.min(multiVersionDiscount + multiProgramDiscount, 25);

        return {
            totalDiscountPercent,
            multiVersionDiscount,
            multiProgramDiscount,
            totalPrograms,
            totalVersions
        };
    }

    // Calculate total cost estimate for schedule
    function calculateTotalCost() {
        let subtotal = 0;
        let hasCustomPricing = false;
        let customPrograms = [];

        activeSchedule.forEach(item => {
            // Calculate cost for each selected version
            item.selectedVersions.forEach(version => {
                const audience = categorizeAudience(version);

                if (audience === 'custom') {
                    hasCustomPricing = true;
                    if (!customPrograms.includes(item.name)) {
                        customPrograms.push(item.name);
                    }
                } else {
                    const cost = calculateProgramCost(audience, item.sessions, item.deliveryMethod);
                    if (cost) {
                        subtotal += cost;
                    }
                }
            });
        });

        // Apply discounts
        const discountInfo = calculateDiscount();
        const discountAmount = subtotal * (discountInfo.totalDiscountPercent / 100);
        const discountedSubtotal = subtotal - discountAmount;

        const hst = discountedSubtotal * HST_RATE;
        const total = discountedSubtotal + hst;

        return {
            subtotal: discountedSubtotal,
            originalSubtotal: subtotal,
            hst,
            total,
            hasCustomPricing,
            customPrograms,
            discountInfo,
            discountAmount
        };
    }

    // Initialize
    init();

    function init() {
        renderPrograms();
        setupEventListeners();
        checkForPreselectedProgram();
    }

    // Check URL for preselected program
    function checkForPreselectedProgram() {
        const urlParams = new URLSearchParams(window.location.search);
        const programId = urlParams.get('program');
        
        if (programId && programsData[programId]) {
            // Scroll to programs section
            setTimeout(() => {
                const programCard = document.querySelector(`[data-program-id="${programId}"]`);
                if (programCard) {
                    programCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight briefly
                    programCard.style.boxShadow = '0 0 20px rgba(190, 30, 45, 0.4)';
                    setTimeout(() => {
                        programCard.style.boxShadow = '';
                    }, 2000);
                }
            }, 500);
        }
    }

    // Render all programs
    function renderPrograms() {
        const grid = document.getElementById('programsGrid');
        grid.innerHTML = '';

        Object.values(programsData).forEach(program => {
            const card = createProgramCard(program);
            grid.appendChild(card);
        });
    }

    // Create program card
    function createProgramCard(program) {
        const card = document.createElement('div');
        card.className = 'program-card-builder';
        card.setAttribute('data-program-id', program.id);

        const isInSchedule = activeSchedule.some(item => item.id === program.id);
        const versionsText = program.versions.length > 3 
            ? `${program.versions.slice(0, 3).join(', ')} +${program.versions.length - 3} more`
            : program.versions.join(', ');

        card.innerHTML = `
            <div class="program-card-header">
                <h3>${program.name}</h3>
                <p class="program-versions-brief">${versionsText}</p>
            </div>
            <div class="program-card-body">
                <p>${program.description}</p>
            </div>
            <div class="program-card-footer">
                <button class="btn-add-program" data-program-id="${program.id}" ${isInSchedule ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                    </svg>
                    ${isInSchedule ? 'Added' : 'Add to Schedule'}
                </button>
            </div>
        `;

        return card;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Add to schedule buttons
        document.getElementById('programsGrid').addEventListener('click', function(e) {
            const btn = e.target.closest('.btn-add-program');
            if (btn && !btn.disabled) {
                const programId = btn.getAttribute('data-program-id');
                addToSchedule(programId);
            }
        });

        // Clear schedule
        document.getElementById('clearSchedule').addEventListener('click', clearSchedule);

        // Proceed to contact
        document.getElementById('proceedToContact').addEventListener('click', showContactForm);

        // Back to schedule
        document.getElementById('backToSchedule').addEventListener('click', hideContactForm);

        // Form submission
        document.getElementById('scheduleContactForm').addEventListener('submit', handleFormSubmission);
    }

    // Show version selection modal
    function showVersionSelectionModal(programId, isEditing = false) {
        const program = programsData[programId];
        if (!program) return;

        currentProgramForSelection = program;

        // Create modal if it doesn't exist
        if (!versionSelectionModal) {
            versionSelectionModal = createVersionSelectionModal();
            document.body.appendChild(versionSelectionModal);
        }

        // Populate modal with detailed program information
        document.getElementById('scheduleModalProgramName').textContent = program.name;
        document.getElementById('scheduleModalProgramTagline').textContent = program.tagline;
        document.getElementById('scheduleModalDescription').textContent = program.description;
        document.getElementById('scheduleModalFocus').textContent = program.focus;

        // Handle adult focus if present
        const adultFocusEl = document.getElementById('scheduleModalFocusAdult');
        if (program.focusAdult) {
            adultFocusEl.textContent = program.focusAdult;
            adultFocusEl.style.display = 'block';
        } else {
            adultFocusEl.style.display = 'none';
        }

        document.getElementById('scheduleModalMaterials').textContent = program.materials;
        document.getElementById('scheduleModalDuration').textContent = program.duration;
        document.getElementById('scheduleModalCurriculum').textContent = program.curriculum;

        // Populate version checkboxes
        const checkboxesContainer = versionSelectionModal.querySelector('.version-checkboxes');
        checkboxesContainer.innerHTML = '';

        // Get current versions if editing
        const currentItem = isEditing ? activeSchedule.find(item => item.id === programId) : null;
        const currentVersions = currentItem ? currentItem.selectedVersions : [];

        program.versions.forEach(version => {
            const isChecked = currentVersions.includes(version);
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'version-checkbox-item';
            checkboxDiv.innerHTML = `
                <label class="version-checkbox-label">
                    <input type="checkbox" value="${version}" class="version-checkbox" ${isChecked ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    ${version}
                </label>
            `;
            checkboxesContainer.appendChild(checkboxDiv);
        });

        // Update button text
        const addBtn = versionSelectionModal.querySelector('.modal-add-selected');
        addBtn.textContent = isEditing ? 'Update Versions' : 'Add Selected Versions';

        // Show modal
        versionSelectionModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on first checkbox
        setTimeout(() => {
            const firstCheckbox = versionSelectionModal.querySelector('.version-checkbox');
            if (firstCheckbox) firstCheckbox.focus();
        }, 100);
    }

    // Edit program versions
    function editProgramVersions(programId) {
        showVersionSelectionModal(programId, true);
    }

    // Create version selection modal
    function createVersionSelectionModal() {
        const modal = document.createElement('div');
        modal.className = 'version-selection-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="modal-header">
                    <h2 id="scheduleModalProgramName"></h2>
                    <p class="program-tagline" id="scheduleModalProgramTagline"></p>
                </div>
                <div class="modal-body">
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                            </svg>
                            Overview
                        </h3>
                        <p id="scheduleModalDescription"></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,3L1,9L12,15L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z"/>
                            </svg>
                            Focus & Purpose
                        </h3>
                        <p id="scheduleModalFocus"></p>
                        <p id="scheduleModalFocusAdult" style="display: none;"></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M7,6H17V8H7V6M7,10H17V12H7V10M7,14H17V16H7V14M7,18H14V20H7V18Z"/>
                            </svg>
                            Materials Provided
                        </h3>
                        <p id="scheduleModalMaterials"></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                            </svg>
                            Duration & Curriculum
                        </h3>
                        <p><strong>Duration:</strong> <span id="scheduleModalDuration"></span></p>
                        <p><strong>Curriculum Connections:</strong> <span id="scheduleModalCurriculum"></span></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,3L1,9L12,15L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z"/>
                            </svg>
                            Select Versions
                        </h3>
                        <p class="modal-description">Choose one or more versions of this program to add to your schedule</p>
                        <div class="version-checkboxes"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Cancel</button>
                    <button class="btn-primary modal-add-selected" disabled>Add Selected Versions</button>
                </div>
            </div>
        `;

        // Event listeners
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const addBtn = modal.querySelector('.modal-add-selected');

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            currentProgramForSelection = null;
        };

        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Handle checkbox changes
        modal.addEventListener('change', (e) => {
            if (e.target.classList.contains('version-checkbox')) {
                const checkedBoxes = modal.querySelectorAll('.version-checkbox:checked');
                addBtn.disabled = checkedBoxes.length === 0;
            }
        });

        // Handle add selected
        addBtn.addEventListener('click', () => {
            const selectedVersions = Array.from(modal.querySelectorAll('.version-checkbox:checked')).map(cb => cb.value);
            if (selectedVersions.length > 0) {
                const modalTitle = modal.querySelector('.modal-title');
                const isEditing = modalTitle && modalTitle.textContent.includes('Edit');
                addProgramWithVersions(currentProgramForSelection.id, selectedVersions, isEditing);
                closeModal();
            }
        });

        // Keyboard navigation
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        return modal;
    }

    // Add program to schedule with selected versions
    function addProgramWithVersions(programId, selectedVersions, isEditing = false) {
        const program = programsData[programId];
        if (!program || selectedVersions.length === 0) return;

        if (isEditing) {
            // Update existing item
            const existingItem = activeSchedule.find(item => item.id === programId);
            if (existingItem) {
                existingItem.selectedVersions = selectedVersions;
            }
        } else {
            // Add new item
            const scheduleItem = {
                id: program.id,
                name: program.name,
                selectedVersions: selectedVersions,
                sessions: program.hasParts ? 2 : 1,
                deliveryMethod: 'inPerson', // default to in-person
                notes: ''
            };

            activeSchedule.push(scheduleItem);
        }

        updateScheduleDisplay();
        updateProgramCards();
        validateCompatibility();
        updateCostEstimate();

        // Track event
        if (typeof gtag !== 'undefined') {
            const eventName = isEditing ? 'program_updated_in_schedule' : 'program_added_to_schedule';
            gtag('event', eventName, {
                'event_category': 'schedule_builder',
                'event_label': `${program.name} (${selectedVersions.length} versions)`,
                'value': selectedVersions.length
            });
        }
    }

    // Update add to schedule button click handler
    // Add program to schedule
    function addToSchedule(programId) {
        showVersionSelectionModal(programId);
    }

    // Remove from schedule
    function removeFromSchedule(programId) {
        activeSchedule = activeSchedule.filter(item => item.id !== programId);
        updateScheduleDisplay();
        updateProgramCards();
        validateCompatibility();
        updateCostEstimate();
    }

    // Update schedule display
    function updateScheduleDisplay() {
        const content = document.getElementById('scheduleContent');
        const count = document.getElementById('scheduleCount');
        const clearBtn = document.getElementById('clearSchedule');
        const proceedBtn = document.getElementById('proceedToContact');

        count.textContent = `(${activeSchedule.length} program${activeSchedule.length !== 1 ? 's' : ''})`;

        if (activeSchedule.length === 0) {
            content.innerHTML = `
                <div class="empty-schedule">
                    <svg viewBox="0 0 24 24" fill="currentColor" class="empty-icon">
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                    </svg>
                    <p>No programs added yet</p>
                    <p class="empty-hint">Click "Add to Schedule" on any program above to get started</p>
                </div>
            `;
            clearBtn.style.display = 'none';
            proceedBtn.style.display = 'none';
        } else {
            content.innerHTML = activeSchedule.map(item => createScheduleItem(item)).join('');
            clearBtn.style.display = 'flex';
            proceedBtn.style.display = 'flex';

            // Setup remove buttons
            content.querySelectorAll('.btn-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    const programId = this.getAttribute('data-program-id');
                    removeFromSchedule(programId);
                });
            });

            // Setup edit buttons
            content.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function() {
                    const programId = this.getAttribute('data-program-id');
                    editProgramVersions(programId);
                });
            });

            // Setup change listeners for delivery method
            content.querySelectorAll('.delivery-select').forEach(select => {
                select.addEventListener('change', function() {
                    const programId = this.getAttribute('data-program-id');
                    const item = activeSchedule.find(i => i.id === programId);
                    if (item) {
                        item.deliveryMethod = this.value;
                        updateCostEstimate();
                    }
                });
            });

            // Setup notes textarea
            content.querySelectorAll('.notes-textarea').forEach(textarea => {
                textarea.addEventListener('input', function() {
                    const programId = this.getAttribute('data-program-id');
                    const item = activeSchedule.find(i => i.id === programId);
                    if (item) {
                        item.notes = this.value;
                    }
                });
            });
        }
    }

    // Create schedule item HTML
    function createScheduleItem(item) {
        const program = programsData[item.id];

        // Create version tags
        const versionTags = item.selectedVersions.map(version => `<span class="version-tag">${version}</span>`).join('');

        return `
            <div class="schedule-item">
                <div class="schedule-item-header">
                    <div>
                        <h4 class="schedule-item-title">${program.name}</h4>
                        <div class="selected-versions">${versionTags}</div>
                    </div>
                    <div class="schedule-item-actions">
                        <button class="btn-edit" data-program-id="${item.id}" aria-label="Edit ${program.name} versions">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                            </svg>
                            Edit
                        </button>
                        <button class="btn-remove" data-program-id="${item.id}" aria-label="Remove ${program.name}">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="schedule-item-body">
                    <div class="form-group-inline">
                        <label for="delivery-${item.id}">Delivery Method *</label>
                        <select id="delivery-${item.id}" class="delivery-select" data-program-id="${item.id}" required>
                            <option value="inPerson" ${item.deliveryMethod === 'inPerson' ? 'selected' : ''}>In-Person</option>
                            <option value="virtual" ${item.deliveryMethod === 'virtual' ? 'selected' : ''}>Virtual</option>
                        </select>
                    </div>
                    <div class="form-group-inline">
                        <label for="notes-${item.id}">Notes (Optional)</label>
                        <textarea id="notes-${item.id}" class="notes-textarea" data-program-id="${item.id}"
                                  placeholder="Any specific requirements or preferences...">${item.notes}</textarea>
                    </div>
                </div>
            </div>
        `;
    }

    // Update program cards (disable if in schedule)
    function updateProgramCards() {
        document.querySelectorAll('.program-card-builder').forEach(card => {
            const programId = card.getAttribute('data-program-id');
            const btn = card.querySelector('.btn-add-program');
            const isInSchedule = activeSchedule.some(item => item.id === programId);

            if (isInSchedule) {
                btn.disabled = true;
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                    </svg>
                    Added
                `;
            } else {
                btn.disabled = false;
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                    </svg>
                    Add to Schedule
                `;
            }
        });
    }

    // Smart validation - grey out incompatible programs
    function validateCompatibility() {
        // Get all selected audiences from schedule (flatten the arrays)
        const selectedAudiences = activeSchedule.flatMap(item => item.selectedVersions);

        // Analyze audience types
        const hasYoungStudents = selectedAudiences.some(a => a.includes('K-3'));
        const hasElementary = selectedAudiences.some(a => a.includes('Gr. 4-6'));
        const hasMiddle = selectedAudiences.some(a => a.includes('Gr. 6-8') || a.includes('Gr. 7-8'));
        const hasHigh = selectedAudiences.some(a => a.includes('Gr. 9-10') || a.includes('Gr. 11-12'));
        const hasAdults = selectedAudiences.some(a =>
            a.includes('Faculty') || a.includes('Educators') ||
            a.includes('Admin') || a.includes('Parents') ||
            a.includes('Corporate') || a.includes('Teams')
        );

        // If no programs in schedule, enable all
        if (activeSchedule.length === 0) {
            document.querySelectorAll('.program-card-builder').forEach(card => {
                card.classList.remove('disabled');
                const overlay = card.querySelector('.disabled-overlay');
                if (overlay) overlay.remove();
            });
            return;
        }

        // Check each program card for compatibility
        document.querySelectorAll('.program-card-builder').forEach(card => {
            const programId = card.getAttribute('data-program-id');
            const program = programsData[programId];

            // Skip if already in schedule
            if (activeSchedule.some(item => item.id === programId)) {
                return;
            }

            let isCompatible = false;
            let reason = '';

            // Check if any version of this program is compatible with selected audiences
            if (hasYoungStudents && program.versions.some(v => v.includes('K-3'))) {
                isCompatible = true;
            }
            if (hasElementary && program.versions.some(v => v.includes('Gr. 4-6'))) {
                isCompatible = true;
            }
            if (hasMiddle && program.versions.some(v => v.includes('Gr. 6-8') || v.includes('Gr. 7-8'))) {
                isCompatible = true;
            }
            if (hasHigh && program.versions.some(v => v.includes('Gr. 9-10') || v.includes('Gr. 11-12'))) {
                isCompatible = true;
            }
            if (hasAdults && program.versions.some(v =>
                v.includes('Faculty') || v.includes('Educators') ||
                v.includes('Admin') || v.includes('Parents') ||
                v.includes('Corporate') || v.includes('Teams') || v.includes('Sr. Admin.')
            )) {
                isCompatible = true;
            }

            // Update card state
            if (!isCompatible) {
                card.classList.add('disabled');
                // Add overlay if not exists
                if (!card.querySelector('.disabled-overlay')) {
                    const overlay = document.createElement('div');
                    overlay.className = 'disabled-overlay';
                    overlay.textContent = 'Not compatible';
                    card.appendChild(overlay);
                }
            } else {
                card.classList.remove('disabled');
                const overlay = card.querySelector('.disabled-overlay');
                if (overlay) overlay.remove();
            }
        });
    }

    // Update cost estimate display
    function updateCostEstimate() {
        // Find or create cost estimate container
        let costContainer = document.getElementById('costEstimate');
        
        if (activeSchedule.length === 0) {
            if (costContainer) {
                costContainer.remove();
            }
            return;
        }

        const costData = calculateTotalCost();
        
        // Create cost estimate HTML
        const costHTML = `
            <div class="cost-estimate-card" id="costEstimate">
                <div class="cost-header">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7,15H9C9,16.08 10.37,17 12,17C13.63,17 15,16.08 15,15C15,13.9 13.96,13.5 11.76,12.97C9.64,12.44 7,11.78 7,9C7,7.21 8.47,5.69 10.5,5.18V3H13.5V5.18C15.53,5.69 17,7.21 17,9H15C15,7.92 13.63,7 12,7C10.37,7 9,7.92 9,9C9,10.1 10.04,10.5 12.24,11.03C14.36,11.56 17,12.22 17,15C17,16.79 15.53,18.31 13.5,18.82V21H10.5V18.82C8.47,18.31 7,16.79 7,15Z"/>
                    </svg>
                    <h3>Estimated Cost</h3>
                </div>
                ${costData.hasCustomPricing && costData.subtotal === 0 ? `
                    <div class="cost-custom-only">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                        <p><strong>Custom Pricing Required</strong></p>
                        <p class="cost-custom-note">For ${costData.customPrograms.join(', ')}, please contact <a href="mailto:aubrey@hellohope.ca">aubrey@hellohope.ca</a> for pricing.</p>
                    </div>
                ` : `
                    <div class="cost-breakdown">
                        <div class="cost-row">
                            <span class="cost-label">Original Subtotal:</span>
                            <span class="cost-value">$${costData.originalSubtotal.toFixed(2)}</span>
                        </div>
                        ${costData.discountInfo.totalDiscountPercent > 0 ? `
                            <div class="cost-row cost-discount">
                                <span class="cost-label">Discount (${costData.discountInfo.totalDiscountPercent}%):</span>
                                <span class="cost-value">-$${costData.discountAmount.toFixed(2)}</span>
                            </div>
                            <div class="cost-row">
                                <span class="cost-label">Subtotal (after discount):</span>
                                <span class="cost-value">$${costData.subtotal.toFixed(2)}</span>
                            </div>
                        ` : `
                            <div class="cost-row">
                                <span class="cost-label">Subtotal:</span>
                                <span class="cost-value">$${costData.subtotal.toFixed(2)}</span>
                            </div>
                        `}
                        <div class="cost-row">
                            <span class="cost-label">HST (13%):</span>
                            <span class="cost-value">$${costData.hst.toFixed(2)}</span>
                        </div>
                        <div class="cost-divider"></div>
                        <div class="cost-row cost-total">
                            <span class="cost-label">Total:</span>
                            <span class="cost-value">$${costData.total.toFixed(2)}</span>
                        </div>
                    </div>
                    ${costData.discountInfo.totalDiscountPercent > 0 ? `
                        <div class="cost-note cost-discount-note">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,7H13V9H11V7M11,11H13V17H11V11Z"/>
                            </svg>
                            <p><strong>Discount Applied:</strong> ${costData.discountInfo.totalDiscountPercent}% off for ${costData.discountInfo.totalPrograms} program${costData.discountInfo.totalPrograms > 1 ? 's' : ''} with ${costData.discountInfo.totalVersions} version${costData.discountInfo.totalVersions > 1 ? 's' : ''} selected.</p>
                        </div>
                    ` : ''}
                    ${costData.hasCustomPricing ? `
                        <div class="cost-note cost-custom">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                            </svg>
                            <p>Additional cost for ${costData.customPrograms.join(', ')}. Please contact <a href="mailto:aubrey@hellohope.ca">aubrey@hellohope.ca</a> for pricing.</p>
                        </div>
                    ` : ''}
                    <div class="cost-note">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                        <p>This is an estimate only. Final quote will be provided upon booking confirmation.</p>
                    </div>
                    <div class="cost-note">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                        </svg>
                        <p>Travel expenses for programs taking place more than 180 km outside of the Greater Toronto Area will be an additional cost.</p>
                    </div>
                `}
            </div>
        `;

        // Insert or update cost estimate
        const scheduleContent = document.getElementById('scheduleContent');
        if (costContainer) {
            costContainer.outerHTML = costHTML;
        } else {
            scheduleContent.insertAdjacentHTML('afterend', costHTML);
        }
    }

    // Clear schedule
    function clearSchedule() {
        if (confirm('Are you sure you want to clear your entire schedule?')) {
            activeSchedule = [];
            updateScheduleDisplay();
            updateProgramCards();
            validateCompatibility();
            updateCostEstimate();
        }
    }

    // Show contact form
    function showContactForm() {
        document.querySelector('.program-selection').style.display = 'none';
        document.querySelector('.active-schedule').style.display = 'none';
        document.getElementById('contactFormSection').style.display = 'block';

        // Populate summary
        populateScheduleSummary();

        // Scroll to form
        document.getElementById('contactFormSection').scrollIntoView({ behavior: 'smooth' });
    }

    // Hide contact form
    function hideContactForm() {
        document.querySelector('.program-selection').style.display = 'block';
        document.querySelector('.active-schedule').style.display = 'flex';
        document.getElementById('contactFormSection').style.display = 'none';

        // Scroll to schedule
        document.querySelector('.active-schedule').scrollIntoView({ behavior: 'smooth' });
    }

    // Populate schedule summary
    function populateScheduleSummary() {
        const summary = document.getElementById('scheduleSummary');

        const summaryHTML = `
            <h3>
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"/>
                </svg>
                Your Program Schedule
            </h3>
            ${activeSchedule.map((item, index) => {
                const program = programsData[item.id];
                return `
                    <div class="summary-item">
                        <h4>${index + 1}. ${program.name}</h4>
                        <div class="summary-detail">
                            <span class="summary-label">Version/Audience:</span>
                            <span class="summary-value">${item.selectedVersions.join(', ')}</span>
                        </div>
                        <div class="summary-detail">
                            <span class="summary-label">Sessions:</span>
                            <span class="summary-value">${program.hasParts && item.sessions === 2 ? 'Part 1 & Part 2' : `${item.sessions} session${item.sessions > 1 ? 's' : ''}`}</span>
                        </div>
                        <div class="summary-detail">
                            <span class="summary-label">Duration:</span>
                            <span class="summary-value">${program.duration}</span>
                        </div>
                        ${item.notes ? `
                            <div class="summary-detail">
                                <span class="summary-label">Notes:</span>
                                <span class="summary-value">${item.notes}</span>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        `;

        summary.innerHTML = summaryHTML;
    }

    // Handle form submission
    async function handleFormSubmission(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite;">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
            </svg>
            Sending...
        `;

        try {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Load EmailJS config
            const configResponse = await fetch('/api/config');
            const config = await configResponse.json();

            // Prepare schedule details with better formatting including delivery method
            const scheduleDetails = activeSchedule.map((item, index) => {
                const program = programsData[item.id];
                const deliveryText = item.deliveryMethod === 'inPerson' ? 'In-Person' : 'Virtual';
                return `
${index + 1}. ${program.name}
   • Version/Audience: ${item.selectedVersions.join(', ')}
   • Delivery Method: ${deliveryText}
   • Sessions: ${program.hasParts && item.sessions === 2 ? 'Part 1 & Part 2' : `${item.sessions} session(s)`}
   • Duration: ${program.duration}${item.notes ? `\n   • Notes: ${item.notes}` : ''}
                `.trim();
            }).join('\n\n');

            // Calculate cost estimate for email
            const costData = calculateTotalCost();
            let costEstimateText = '\n\nESTIMATED COST:\n';
            if (costData.hasCustomPricing && costData.subtotal === 0) {
                costEstimateText += 'Custom pricing required for all programs.\n';
                costEstimateText += `Please contact for pricing on: ${costData.customPrograms.join(', ')}`;
            } else {
                costEstimateText += `Original Subtotal: $${costData.originalSubtotal.toFixed(2)}\n`;
                if (costData.discountInfo.totalDiscountPercent > 0) {
                    costEstimateText += `Discount (${costData.discountInfo.totalDiscountPercent}%): -$${costData.discountAmount.toFixed(2)}\n`;
                    costEstimateText += `Subtotal (after discount): $${costData.subtotal.toFixed(2)}\n`;
                } else {
                    costEstimateText += `Subtotal: $${costData.subtotal.toFixed(2)}\n`;
                }
                costEstimateText += `HST (13%): $${costData.hst.toFixed(2)}\n`;
                costEstimateText += `Total: $${costData.total.toFixed(2)}\n`;
                if (costData.discountInfo.totalDiscountPercent > 0) {
                    costEstimateText += `\n* Discount applied: ${costData.discountInfo.totalDiscountPercent}% off for ${costData.discountInfo.totalPrograms} program${costData.discountInfo.totalPrograms > 1 ? 's' : ''} with ${costData.discountInfo.totalVersions} version${costData.discountInfo.totalVersions > 1 ? 's' : ''} selected.`;
                }
                if (costData.hasCustomPricing) {
                    costEstimateText += `\n* Additional cost required for: ${costData.customPrograms.join(', ')}\n`;
                    costEstimateText += '* Please contact for complete pricing.';
                } else {
                    costEstimateText += '\n* This is an estimate only. Final quote upon confirmation.';
                }
            }

            // Use dedicated schedule template if available, fallback to regular template
            const scheduleTemplateId = config.emailjs.scheduleTemplateId || config.emailjs.templateId;

            // Send email via EmailJS
            const response = await emailjs.send(
                config.emailjs.serviceId,
                scheduleTemplateId,
                {
                    from_name: data.name,
                    from_email: data.email,
                    phone: data.phone || 'Not provided',
                    organization: data.organization,
                    preferred_dates: data.dates || 'Not specified',
                    schedule_details: scheduleDetails + costEstimateText,
                    additional_notes: data.notes || 'None provided',
                    to_email: 'aubrey@hellohope.ca'
                }
            );

            if (response.status === 200) {
                // Success
                showMessage('success', 'Schedule request sent successfully! We\'ll be in touch within 24-48 hours.');
                
                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'schedule_submitted', {
                        'event_category': 'schedule_builder',
                        'event_label': `${activeSchedule.length} programs`,
                        'value': activeSchedule.length
                    });
                }

                // Reset after delay
                setTimeout(() => {
                    form.reset();
                    activeSchedule = [];
                    hideContactForm();
                    updateScheduleDisplay();
                    updateProgramCards();
                    validateCompatibility();
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'Sorry, there was an error sending your request. Please try again or contact us directly.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    // Show message
    function showMessage(type, text) {
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                ${type === 'success' 
                    ? '<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>'
                    : '<path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>'
                }
            </svg>
            ${text}
        `;

        const form = document.getElementById('scheduleContactForm');
        form.parentNode.insertBefore(message, form);

        // Remove after 5 seconds
        setTimeout(() => message.remove(), 5000);
    }
});

// Add spin animation for loading
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
