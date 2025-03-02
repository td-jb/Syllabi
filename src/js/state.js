export class AppState {
    constructor(syllabi) {
        this.syllabi = syllabi;
        this.currentCourse = null;
    }

    setCurrentCourse(courseId) {
        this.currentCourse = courseId;
    }

    getCurrentSyllabus() {
        return this.syllabi[this.currentCourse];
    }
}