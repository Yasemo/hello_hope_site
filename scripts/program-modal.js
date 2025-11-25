// Program Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Program data
    const programData = {
        'hello-hope': {
            name: 'HELLO HOPE',
            tagline: 'Battling Loneliness & The Other Things That Can Weigh Us Down',
            description: 'Social media promised connection, but delivered toxic comparison. Now AI is replacing friendships. This session delivers practical tools for building real human bonds that actually stick.',
            focus: 'This student session focuses on bringing encouragement and relief to participants to tackle stress and anxiety during and after a pandemic. Learning components include the connection between social media, empathy and the health benefits of face to face interaction, and practical take-aways on how to create stronger bonds with others.',
            materials: 'Students will receive practical handouts with strategies for managing stress, building authentic connections, and creating healthier relationships with technology and peers.',
            versions: ['Gr. 4-6', 'Gr. 7-8', 'Gr. 9-10', 'Gr. 11-12', 'Elementary Faculty', 'Secondary Faculty', 'Parents/Guardians', 'Corporate', 'Teams'],
            duration: '60 min',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity.'
        },
        'colour-blind': {
            name: 'COLOUR BLIND?',
            tagline: 'Why Being "Not Racist" Is Not Enough Anymore',
            description: 'Good intentions don\'t fix systemic racism. Silence isn\'t neutrality. Part 1 explores why this fight against racism is a matter of the heart. Part 2 delivers actionable steps to be the opposite of racist.',
            focus: 'PART 1 for Students focuses on why this issue is even worth our time and why it needs to be a matter of the heart before change can occur. The three objectives are: (1) To explain what racism is and isn\'t once and for all, (2) to help us see how it connects to us here and now, and (3) to inspire us to be the opposite of racist for the long haul. PART 2 focuses on practical ways we can interrupt racism and create a sweeter, safer, stronger school community.',
            focusAdult: 'The adult versions have three objectives: (1) to remind you that it is not just "ok" but it is crucial that we come together and have a million of these conversations, (2) to help you identify where you are at on this journey of awareness and combating racism, and (3) to inspire you to be the opposite for the long haul (regardless of how old you are). Part 2 for adults helps us identify where we go from here with actionable steps and guiding principles for your anti-racism practice.',
            materials: 'Grade 7-12 students receive a handout entitled "Stuff to Pack and Steps to Take for Your Anti-Racism Journey" with age-appropriate book titles, articles, and videos. Primary students receive a printable colour poster with the "Three Truths" about skin colour and a working definition of racism in kid-friendly language.',
            versions: ['Gr. 7-8', 'Gr. 9-10', 'Gr. 11-12', 'Elementary Faculty', 'Secondary Faculty', 'Parents/Guardians', 'Corporate', 'Teams'],
            duration: '60 min each (Part 1 & Part 2 available)',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity. Global citizenship and communities, local communities (social studies), Canada a changing society.'
        },
        'stick-truth': {
            name: 'STICK WITH THE TRUTH',
            tagline: 'Three Truths About Skin Colour',
            description: 'Our youngest students learn the three truths about skin colour and are equipped in an age-appropriate way to stick with those truths whenever they may encounter lies about skin colour which can cause hate, hurt, and harm.',
            focus: 'The Primary Presentation focuses on the three truths about skin colour and on equipping students in an age-appropriate way to stick with those truths so as not to believe any lies about skin colour which cause harm. PART 2 (for Gr. 4-6) focuses on practical ways we can interrupt racism and create a sweeter, safer, stronger school community in an age appropriate way.',
            materials: 'Primary and junior students will receive a printable colour poster with the "Three Truths" about skin colour, and a working definition of racism in kid-friendly language.',
            versions: ['K-3 (1 part only)', 'Gr. 4-6 (Part 1 & Part 2 available)'],
            duration: '60 min each',
            curriculum: 'Global citizenship and communities, local communities (social studies), Canada a changing society.'
        },
        'just-here': {
            name: 'I\'M JUST HERE',
            tagline: 'What Am I Doing? What\'s The Point? Where Can I Go?',
            description: 'Some kids are existing, not living. Purpose feels like a luxury when you\'re just surviving. Raw talk on self-identity, peer conflicts, and the secret to supreme satisfaction.',
            focus: '"I\'m just here." Some of us don\'t have a clue what we are doing, what the point is, or where we can go from here. Many of us are existing but not really living as we feel a sense of purposelessness. This raw, sincere, and encouraging talk tackles peer-conflicts and motivation for the future by going upstream to look at self-identity, purpose, and the "secret to supreme satisfaction".',
            materials: 'Students receive guidance materials focused on self-discovery, purpose-finding exercises, and practical strategies for navigating peer relationships and future planning.',
            versions: ['Gr. 7-8', 'Gr. 9-10', 'Gr. 11-12'],
            duration: '60 min',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity.'
        },
        'man-up': {
            name: 'MAN UP',
            tagline: 'Being A "Real Man" In Unreal Times',
            description: 'Boys are getting masculinity lessons from influencers. This session delivers straight conversation about male influence on culture and practical tools for using it for good.',
            focus: 'A no-joke conversation about the reality of the male influence on culture, the opportunity to use that influence for good, and practical tools to do it solo or with a squad.',
            materials: 'Grade 7-12 students will receive a handout entitled "Man Up - Cheat Sheet" which has age-appropriate words of affirmations for young boys to encourage themselves with as well as a couple of tips from the presentation to implement in their own interpersonal relationships.',
            versions: ['Gr. 6-8', 'Gr. 9-10', 'Gr. 11-12','Teams'],
            duration: '60 min',
            curriculum: 'Global/responsible citizenship, interrelationships, perspective, the local community, Social-Emotional Learning, Healthy relationships, self-awareness and sense of identity.'
        },
        'reconnect': {
            name: 'RECONNECT',
            tagline: 'Finding Purpose In The Exhaustion',
            description: 'Teachers are exhausted. Administrators are overwhelmed. Everyone\'s running on empty. This one-hour recharge helps your team reconnect to what matters and reach the finish line.',
            focus: 'A focused session designed specifically for educators and administrators who are experiencing burnout and compassion fatigue. This presentation provides practical strategies for managing stress, reconnecting with purpose, and building resilience within educational teams.',
            materials: 'Educators receive self-care resources, burnout prevention strategies, and team-building exercises to implement in their schools.',
            versions: ['Educators', 'Administration', 'Special Teams'],
            duration: '60 min',
            curriculum: 'Professional development, wellness, team building, leadership development.'
        }
    };

    // Get all "Learn More" buttons
    const learnMoreButtons = document.querySelectorAll('.enroll_btn');
    
    // Create modal element if it doesn't exist
    let modal = document.getElementById('programModal');
    if (!modal) {
        modal = createModalElement();
        document.body.appendChild(modal);
    }

    // Add click event listeners to all "Learn More" buttons
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle if it's not an external link
            if (!href || (!href.startsWith('/') && !href.startsWith('http'))) {
                e.preventDefault();
                
                const programId = this.getAttribute('data-program');
                if (programId && programData[programId]) {
                    openModal(programId);
                    
                    // Track modal open event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'program_modal_opened', {
                            'event_category': 'programs',
                            'event_label': programId,
                            'page_location': window.location.href
                        });
                    }
                }
            }
        });
    });

    function createModalElement() {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'programModal';
        modalDiv.className = 'program-modal';
        modalDiv.setAttribute('aria-hidden', 'true');
        modalDiv.setAttribute('role', 'dialog');
        modalDiv.setAttribute('aria-modal', 'true');
        
        modalDiv.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="modal-header">
                    <h2 id="modalProgramName"></h2>
                    <p class="program-tagline" id="modalProgramTagline"></p>
                </div>
                <div class="modal-body">
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                            </svg>
                            Overview
                        </h3>
                        <p id="modalDescription"></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.82,9L12,12.72L5.18,9L12,5.28L18.82,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z"/>
                            </svg>
                            Focus & Purpose
                        </h3>
                        <p id="modalFocus"></p>
                        <p id="modalFocusAdult" style="display: none;"></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M7,6H17V8H7V6M7,10H17V12H7V10M7,14H17V16H7V14M7,18H14V20H7V18Z"/>
                            </svg>
                            Materials Provided
                        </h3>
                        <p id="modalMaterials"></p>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                            </svg>
                            Available Versions
                        </h3>
                        <div class="versions-grid" id="modalVersions"></div>
                    </div>
                    <div class="modal-section">
                        <h3>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                            </svg>
                            Duration & Curriculum
                        </h3>
                        <p><strong>Duration:</strong> <span id="modalDuration"></span></p>
                        <p><strong>Curriculum Connections:</strong> <span id="modalCurriculum"></span></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#" class="modal-btn modal-btn-primary" id="modalScheduleBtn">Build Your Schedule</a>
                    <button class="modal-btn modal-btn-secondary" id="modalContactBtn">Contact Us</button>
                </div>
            </div>
        `;
        
        return modalDiv;
    }

    function openModal(programId) {
        const program = programData[programId];
        if (!program) return;

        // Populate modal content
        document.getElementById('modalProgramName').textContent = program.name;
        document.getElementById('modalProgramTagline').textContent = program.tagline;
        document.getElementById('modalDescription').textContent = program.description;
        document.getElementById('modalFocus').textContent = program.focus;
        
        // Handle adult focus if present
        const adultFocusEl = document.getElementById('modalFocusAdult');
        if (program.focusAdult) {
            adultFocusEl.textContent = program.focusAdult;
            adultFocusEl.style.display = 'block';
        } else {
            adultFocusEl.style.display = 'none';
        }
        
        document.getElementById('modalMaterials').textContent = program.materials;
        document.getElementById('modalDuration').textContent = program.duration;
        document.getElementById('modalCurriculum').textContent = program.curriculum;

        // Populate versions
        const versionsContainer = document.getElementById('modalVersions');
        versionsContainer.innerHTML = '';
        program.versions.forEach(version => {
            const versionTag = document.createElement('div');
            versionTag.className = 'version-tag';
            versionTag.textContent = version;
            versionsContainer.appendChild(versionTag);
        });

        // Update schedule button link
        const scheduleBtn = document.getElementById('modalScheduleBtn');
        scheduleBtn.href = `/programs.html?program=${programId}`;

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus on close button
        setTimeout(() => {
            modal.querySelector('.modal-close').focus();
        }, 100);
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Close modal listeners
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalContactBtn = document.getElementById('modalContactBtn');

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    modalContactBtn.addEventListener('click', function() {
        closeModal();
        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const headerHeight = 70;
            const targetPosition = contactSection.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const modalContent = modal.querySelector('.modal-content');
    modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Focus trap
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('active')) return;

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
});
