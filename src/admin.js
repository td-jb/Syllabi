// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    // Add your Firebase config here
    apiKey: "your-api-key",
    authDomain: "your-domain.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentEditor = null;
let currentCourse = null;

// Add authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';
        loadCourseList(); // Load courses when authenticated
    } else {
        // User is signed out
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('adminContainer').style.display = 'none';
    }
});

// Login function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Successfully logged in - onAuthStateChanged will handle the rest
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

// Logout function
async function logout() {
    try {
        await signOut(auth);
        // Successfully logged out - onAuthStateChanged will handle the rest
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
}

function initializeEditor(container, data) {
    currentEditor = new JSONEditor(container, {
        mode: 'tree',
        modes: ['tree', 'code'],
        onChangeText: (jsonString) => {
            try {
                JSON.parse(jsonString);
                document.getElementById('saveButton').disabled = false;
            } catch (err) {
                document.getElementById('saveButton').disabled = true;
            }
        }
    });
    currentEditor.set(data);
}

async function loadCourseList() {
    try {
        const coursesRef = collection(db, "syllabi");
        const querySnapshot = await getDocs(coursesRef);
        const courseList = document.getElementById('courseList');
        courseList.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.data().title || doc.id;
            courseList.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading course list:', error);
        alert('Error loading courses. Please check the console for details.');
    }
}

async function loadCourse() {
    const courseId = document.getElementById('courseList').value;
    if (!courseId) return;

    try {
        const docRef = doc(db, "syllabi", courseId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentCourse = courseId;
            initializeEditor(document.getElementById('jsonEditor'), docSnap.data());
        } else {
            alert('No such course!');
        }
    } catch (error) {
        console.error('Error loading course:', error);
        alert('Error loading course. Please check the console for details.');
    }
}

async function saveSyllabus() {
    if (!currentEditor || !currentCourse || !auth.currentUser) return;

    try {
        const updatedData = currentEditor.get();
        const docRef = doc(db, "syllabi", currentCourse);
        
        await setDoc(docRef, {
            ...updatedData,
            lastModified: new Date().toISOString(),
            modifiedBy: auth.currentUser.email
        });

        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Error saving syllabus:', error);
        alert('Error saving changes. Please check the console for details.');
    }
}

async function addNewCourse() {
    if (!auth.currentUser) return;

    const newCourseTemplate = {
        // Your existing course template
    };

    try {
        // Generate a unique ID for the new course
        const timestamp = new Date().getTime();
        const newCourseId = `course_${timestamp}`;
        
        // Save the new course to Firebase
        const docRef = doc(db, "syllabi", newCourseId);
        await setDoc(docRef, {
            ...newCourseTemplate,
            createdAt: new Date().toISOString(),
            createdBy: auth.currentUser.email
        });

        // Reload the course list and select the new course
        await loadCourseList();
        document.getElementById('courseList').value = newCourseId;
        currentCourse = newCourseId;
        
        initializeEditor(document.getElementById('jsonEditor'), newCourseTemplate);
    } catch (error) {
        console.error('Error creating new course:', error);
        alert('Error creating new course. Please check the console for details.');
    }
}

// Add HTML for login form
document.body.innerHTML = `
    <div id="loginContainer">
        <h2>Admin Login</h2>
        <form id="loginForm" onsubmit="login(event)">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>

    <div id="adminContainer" style="display: none;">
        <div class="header">
            <button onclick="logout()">Logout</button>
        </div>
        <div class="controls">
            <select id="courseList" onchange="loadCourse()">
                <option value="">Select a course...</option>
            </select>
            <button onclick="addNewCourse()">Add New Course</button>
            <button id="saveButton" onclick="saveSyllabus()" disabled>Save Changes</button>
        </div>
        <div id="jsonEditor"></div>
    </div>
`;

// Add some basic styles
const styles = `
    #loginContainer {
        max-width: 300px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    #loginForm input {
        width: 100%;
        margin-bottom: 10px;
        padding: 8px;
    }
    .header {
        padding: 10px;
        text-align: right;
    }
    .controls {
        margin-bottom: 20px;
    }
    #jsonEditor {
        height: calc(100vh - 150px);
    }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Initialize authentication listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';
        loadCourseList();
    } else {
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('adminContainer').style.display = 'none';
    }
});