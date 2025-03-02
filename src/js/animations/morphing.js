import { ANIMATION_SETTINGS } from './constants';

export class MorphingAnimation {
    constructor(elements) {
        this.elts = elements;
        this.morph = 0;
        this.cooldown = ANIMATION_SETTINGS.cooldownTime;
        this.lastTime = new Date();
        this.isAnimating = false;
    }

    start(newText, newContent) {
        // Store new content
        const oldContent = this.elts.content2.innerHTML;
        const oldText = this.elts.text2.textContent;

        // Update content immediately
        this.elts.content1.innerHTML = oldContent;
        this.elts.content2.innerHTML = newContent;

        // Calculate and set container height
        const container = document.getElementById('contentMorphContainer');
        const content1Height = this.elts.content1.offsetHeight;
        const content2Height = this.elts.content2.offsetHeight;
        container.style.minHeight = `${Math.max(content1Height, content2Height)}px`;

        // Apply threshold filter to containers
        document.getElementById('morphContainer').style.filter = 'url(#threshold) blur(0.6px)';
        container.style.filter = 'url(#threshold) blur(0.6px)';

        // Set initial states
        this.elts.content1.style.opacity = '1';
        this.elts.content1.style.position = 'absolute';
        this.elts.content1.style.display = 'block';
        this.elts.content1.style.transform = 'scale(1)';
        this.elts.content1.style.width = '100%';
        this.elts.content1.style.top = '0';
        this.elts.content1.style.left = '0';

        this.elts.content2.style.opacity = '0';
        this.elts.content2.style.position = 'absolute';
        this.elts.content2.style.display = 'block';
        this.elts.content2.style.transform = 'scale(1)';
        this.elts.content2.style.width = '100%';
        this.elts.content2.style.top = '0';
        this.elts.content2.style.left = '0';

        // Update header text
        this.elts.text1.textContent = oldText;
        this.elts.text2.textContent = newText;
        
        this.elts.text1.style.opacity = '1';
        this.elts.text1.style.display = 'block';
        this.elts.text2.style.opacity = '0';
        this.elts.text2.style.display = 'block';

        // Reset animation state
        this.morph = 0;
        this.cooldown = 0;
        this.isAnimating = true;
        this.lastTime = new Date();

        // Start animation
        this.animate();
    }

    setMorph(fraction) {
        // Content morphing
        this.elts.content2.style.opacity = fraction;
        this.elts.content1.style.opacity = 1 - fraction;

        // Text morphing
        this.elts.text2.style.opacity = fraction;
        this.elts.text1.style.opacity = 1 - fraction;

        // Ensure both are visible during transition
        this.elts.text1.style.display = 'block';
        this.elts.text2.style.display = 'block';
        this.elts.content1.style.display = 'block';
        this.elts.content2.style.display = 'block';
    }

    cleanup() {
        // Reset container height
        const container = document.getElementById('contentMorphContainer');
        container.style.minHeight = 'auto';

        // Maintain filters
        document.getElementById('morphContainer').style.filter = 'url(#threshold) blur(0.6px)';
        container.style.filter = 'url(#threshold) blur(0.6px)';

        // Clean up content
        this.elts.content1.style.display = 'none';
        this.elts.content2.style.display = 'block';
        this.elts.content2.style.opacity = '1';
        this.elts.content2.style.position = 'relative';

        // Clean up header text
        this.elts.text1.style.display = 'none';
        this.elts.text2.style.display = 'block';
        this.elts.text2.style.opacity = '1';

        // Copy final content state
        this.elts.content1.innerHTML = this.elts.content2.innerHTML;
    }

    animate = () => {
        if (!this.isAnimating) return;

        requestAnimationFrame(this.animate);

        const newTime = new Date();
        const dt = (newTime - this.lastTime) / 1000;
        this.lastTime = newTime;

        this.cooldown -= dt;

        if (this.cooldown <= 0) {
            this.morph += dt;
            this.cooldown = 0;

            let fraction = this.morph / ANIMATION_SETTINGS.morphTime;

            if (fraction >= 1) {
                fraction = 1;
                this.isAnimating = false;
                this.cleanup();
            }

            this.setMorph(fraction);
        }
    }
}