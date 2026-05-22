/**
 * UKS DIGITAL TWIN LAB - Interaction Logic
 */

// 1. Typing Effect for Hero
const typingName = document.getElementById('typing-name');
const name = "Uddhav Kishan Saxena";
let index = 0;

function type() {
    if (index < name.length) {
        typingName.textContent += name.charAt(index);
        index++;
        setTimeout(type, 100);
    }
}

// 2. Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

// 3. Modal Logic
const modal = document.getElementById('modal');
const modalPlaceholder = document.getElementById('modal-image-placeholder');
const modalCaption = document.getElementById('modal-caption');

const modalContent = document.getElementById('modal-content');

function openModal(id, caption) {
    // Clear previous content
    modalContent.innerHTML = '';
    
    if (id.includes('.html')) {
        const iframe = document.createElement('iframe');
        iframe.src = id;
        iframe.className = 'w-full h-full border-0 bg-lab';
        modalContent.appendChild(iframe);
    } else if (id.includes('assets/images/') || id.includes('assets/videos/')) {
        const img = document.createElement('img');
        img.src = id;
        img.className = 'max-w-full max-h-full object-contain shadow-2xl';
        modalContent.appendChild(img);
    } else {
        const span = document.createElement('span');
        span.id = 'modal-image-placeholder';
        span.className = 'text-sm text-neon/40 font-mono uppercase tracking-widest';
        span.textContent = `[LOADING_RESOURCE: ${id}.data] ... ${caption}`;
        modalContent.appendChild(span);
    }
    
    modalCaption.textContent = `ANALYSIS_MODE: ${caption}`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
}

// 4. Draggable UI Logic
function initDraggableUI() {
    const draggables = document.querySelectorAll('.draggable-ui');
    
    draggables.forEach(el => {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        el.addEventListener('mousedown', startDrag);
        el.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            isDragging = true;
            const event = e.type === 'touchstart' ? e.touches[0] : e;
            
            // Prevent event bubbling so we don't trigger the modal click
            e.stopPropagation();
            
            startX = event.clientX;
            startY = event.clientY;
            
            // Get current position relative to parent
            const rect = el.getBoundingClientRect();
            const parentRect = el.parentElement.getBoundingClientRect();
            initialLeft = rect.left - parentRect.left;
            initialTop = rect.top - parentRect.top;

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            e.stopPropagation();

            const event = e.type === 'touchmove' ? e.touches[0] : e;
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // Contain within parent
            const parentRect = el.parentElement.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            newLeft = Math.max(0, Math.min(newLeft, parentRect.width - elRect.width));
            newTop = Math.max(0, Math.min(newTop, parentRect.height - elRect.height));

            el.style.left = `${newLeft}px`;
            el.style.top = `${newTop}px`;
            el.style.bottom = 'auto'; // Clear bottom/right if they were set
            el.style.right = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
        }
    });
}

// 5. Message Listener for 3D Iframe Data
window.addEventListener('message', (event) => {
    if (event.data.type === 'ROBO_DATA') {
        const data = event.data.data;
        
        // Update Time & Phase
        document.getElementById('main-time').textContent = `T +${data.time}s`;
        document.getElementById('main-phase').textContent = `Phase: ${data.phase}`;
        
        // Update End Effector
        document.getElementById('main-pos').textContent = data.pos;
        const statusEl = document.getElementById('main-status');
        if (data.isBoundary) {
            statusEl.textContent = 'BOUNDARY';
            statusEl.className = 'text-orange-400 animate-pulse';
        } else {
            statusEl.textContent = 'VALID';
            statusEl.className = 'text-green-neon';
        }
        
        // Update Joints
        const jointContainer = document.getElementById('main-joints');
        jointContainer.innerHTML = data.joints.map(j => `
            <span class="px-2 py-1 bg-green-neon/10 border border-green-neon/20 rounded text-[9px] text-green-neon">
                J${j.id}: ${j.angle}°
            </span>
        `).join('');
    }
});

// 6. Initialize
window.addEventListener('load', () => {
    // Start typing effect
    type();
    
    // Initialize Draggable UI
    initDraggableUI();
    
    // Add reveal class to sections
    document.querySelectorAll('section, .group, .border').forEach(el => {
        el.classList.add('reveal');
    });
    
    // Trigger initial reveal
    reveal();
});

window.addEventListener('scroll', reveal);

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// 5. Navigation Smooth Scroll
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
