import './style.scss';
import syllabi from './syllabi.json';
import { MorphingAnimation } from './js/animations/morphing';
import { Navigation } from './js/components/navigation';
import { CourseList } from './js/components/courseList';
import { Syllabus } from './js/components/syllabus';
import { AppState } from './js/state';

class App {
    constructor() {
        console.log('App initializing...');
        this.state = new AppState(syllabi);
        this.initializeElements();
        this.initializeComponents();
    }

    initializeElements() {
        console.log('Initializing elements...');
        this.elements = {
            text1: document.getElementById("text1"),
            text2: document.getElementById("text2"),
            content1: document.getElementById("content1"),
            content2: document.getElementById("content2"),
            nav: document.querySelector("#sectionNav ul"), // Make sure this matches your HTML
            courseList: document.querySelector("#courseNav ul")
        };
    
        // Verify elements were found
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                console.error(`Element not found: ${key}`);
            }
        });
    }

    initializeComponents() {
        console.log('Initializing components...');
        this.morphing = new MorphingAnimation(this.elements);
        this.navigation = new Navigation(this.elements.nav);
        this.courseList = new CourseList(this.elements.courseList, this.state.syllabi);
        
        // Initialize first course
        const firstCourseId = Object.keys(this.state.syllabi)[0];
        console.log('First course ID:', firstCourseId);
        
        // Initialize course list with callback
        this.courseList.initialize((courseId) => {
            console.log('Course selected:', courseId);
            this.showSyllabus(courseId);
        });

        // Show initial syllabus
        this.showSyllabus(firstCourseId);
    }

    showSyllabus(courseId) {
        console.log('Showing syllabus:', courseId);
        this.state.setCurrentCourse(courseId);
        const syllabus = this.state.getCurrentSyllabus();
        console.log('Current syllabus:', syllabus);
        
        // Initialize navigation
        this.navigation.initialize(syllabus);
        
        // Render syllabus content
        const renderedContent = Syllabus.render(syllabus);
        console.log('Rendered content:', renderedContent);
        
        // Start morphing animation
        this.morphing.start(syllabus.title, renderedContent);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    window.app = new App();
});