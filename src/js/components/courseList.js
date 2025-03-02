// In courseList.js
export class CourseList {
    constructor(container, syllabi) {
        this.container = container;
        this.syllabi = syllabi;
        this.activeLink = null;
    }

    initialize(onCourseChange) {
        this.onCourseChange = onCourseChange;
        this.render();
        this.attachEventListeners();
        this.setInitialActive();
    }

    render() {
        if (!this.container) {
            console.error('Course list container not found');
            return;
        }

        this.container.innerHTML = Object.entries(this.syllabi)
            .map(([id, course]) => `
                <li>
                    <a href="#" 
                       data-course="${id}" 
                       class="course-link">
                        ${course.title}
                    </a>
                </li>
            `).join('');
    }

    attachEventListeners() {
        const courseLinks = this.container.querySelectorAll('.course-link');
        
        courseLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCourseClick(e.target);
            });

            // Optional: Add hover effect listener
            link.addEventListener('mouseenter', (e) => {
                this.handleCourseHover(e.target);
            });
        });
    }

    handleCourseClick(clickedLink) {
        const courseId = clickedLink.getAttribute('data-course');
        
        // Update active states
        if (this.activeLink) {
            this.activeLink.classList.remove('active');
        }
        clickedLink.classList.add('active');
        this.activeLink = clickedLink;

        // Trigger course change callback
        if (this.onCourseChange) {
            this.onCourseChange(courseId);
        }
    }

    handleCourseHover(hoveredLink) {
        // Add any hover effects you want here
        // For example, showing a preview or tooltip
    }

    setInitialActive() {
        // Set the first course as active by default
        const firstCourseLink = this.container.querySelector('.course-link');
        if (firstCourseLink) {
            this.handleCourseClick(firstCourseLink);
        }
    }

    setActiveCourse(courseId) {
        const courseLink = this.container.querySelector(`[data-course="${courseId}"]`);
        if (courseLink) {
            this.handleCourseClick(courseLink);
        }
    }

    // Method to update course list if syllabi change
    updateCourses(newSyllabi) {
        this.syllabi = newSyllabi;
        this.render();
        this.attachEventListeners();
        this.setInitialActive();
    }

    // Optional: Method to add a new course
    addCourse(id, course) {
        if (this.syllabi[id]) {
            console.warn(`Course with ID ${id} already exists`);
            return;
        }

        this.syllabi[id] = course;
        this.updateCourses(this.syllabi);
    }

    // Optional: Method to remove a course
    removeCourse(id) {
        if (!this.syllabi[id]) {
            console.warn(`Course with ID ${id} not found`);
            return;
        }

        delete this.syllabi[id];
        this.updateCourses(this.syllabi);
    }

    // Cleanup method
    cleanup() {
        const courseLinks = this.container.querySelectorAll('.course-link');
        courseLinks.forEach(link => {
            link.removeEventListener('click', this.handleCourseClick);
            link.removeEventListener('mouseenter', this.handleCourseHover);
        });
    }
}
