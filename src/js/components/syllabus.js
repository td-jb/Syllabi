export class Syllabus {
    static render(syllabusData) {
        console.log('Rendering syllabus data:', syllabusData);
        
        if (!syllabusData || !syllabusData.sections) {
            console.error('Invalid syllabus data');
            return '';
        }

        return `
            <div class="syllabus">
                ${Object.entries(syllabusData.sections)
                    .map(([sectionId, section]) => {
                        console.log('Rendering section:', sectionId, section);
                        return `
                            <section id="${sectionId}" class="syllabus-section">
                                <h2>${section.title}</h2>
                                ${this.renderSection(sectionId, section)}
                            </section>
                        `;
                    }).join('')}
            </div>
        `;
    }

    static renderSection(sectionId, section) {
        if (typeof section.content === 'string') {
            return `<p class="section-content">${section.content}</p>`;
        }
        
        if (Array.isArray(section.content)) {
            return `
                <ul class="objectives-list">
                    ${section.content.map(item => `
                        <li>${item}</li>
                    `).join('')}
                </ul>
            `;
        }
        
        if (section.timeInfo) {
            return `
                <div class="schedule-info">
                    <p>Lectures: ${section.timeInfo.lectures}<br>
                    Hands-On Labs: ${section.timeInfo.labs}</p>
                </div>
                <div class="weekly-topics">
                    ${section.modules.map(module => `
                        <div class="module">
                            <h4>${module.title}</h4>
                            <ul class="weeks-list">
                                ${module.weeks.map(week => `
                                    <li class="week-item">
                                        <strong>Week ${week.week}:</strong> ${week.topic}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        if (section.overview) {
            return `
                <div class="assignments-overview">
                    <div class="main-assignments">
                        <ul class="overview-list">
                            ${section.overview.map(item => `
                                <li class="overview-item">${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="weekly-exercises">
                        <ul class="exercise-list">
                            ${section.weeklyExercises.map(exercise => `
                                <li class="exercise-item">
                                    <strong>Week ${exercise.week}:</strong> ${exercise.description}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
        
        if (section.breakdown) {
            return `
                <div class="grading-info">
                    <div class="grade-breakdown">
                        <ul class="breakdown-list">
                            ${section.breakdown.map(item => `
                                <li class="breakdown-item">
                                    <span class="component">${item.component}:</span> 
                                    <span class="percentage">${item.percentage}%</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="grade-scale">
                        <ul class="scale-list">
                            ${section.scale.map(item => `
                                <li class="scale-item">
                                    <span class="grade">${item.grade}:</span> 
                                    <span class="range">${item.range}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }
    
        return '';
    }
}