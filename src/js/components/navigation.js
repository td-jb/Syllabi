export class Navigation {
    constructor(container) {
        this.container = container;
    }

    initialize(syllabusData) {
        console.log('Initializing section nav with data:', syllabusData);
        
        if (!this.container) {
            console.error('Navigation container not found');
            return;
        }

        // Generate nav items from sections in the JSON
        const navItems = Object.entries(syllabusData.sections)
            .map(([sectionId, section]) => {
                console.log('Creating nav item for section:', sectionId, section);
                return `<li><a href="#${sectionId}">${section.title}</a></li>`;
            }).join('');
        
        console.log('Generated nav items:', navItems);
        this.container.innerHTML = navItems;

        // Add event listeners for smooth scrolling
        const sectionLinks = this.container.querySelectorAll('a');
        console.log('Found section links:', sectionLinks.length);
        
        sectionLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset ;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active section on scroll
        this.scrollHandler = () => {
            const sections = document.querySelectorAll('.syllabus section');
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerOffset = document.querySelector('header').offsetHeight;
                
                if (window.pageYOffset >= sectionTop - headerOffset - 50) {
                    currentSection = section.getAttribute('id');
                }
            });

            sectionLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', this.scrollHandler);
    }

    cleanup() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
    }
}