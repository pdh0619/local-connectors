import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  increment, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TravelCourse, WebsiteSettings, CourseProposal } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Target database ID
const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, dbId);

// Collections
const COURSES_COL = 'courses';
const SETTINGS_COL = 'settings';
const PROPOSALS_COL = 'proposals';

// --- Courses Operations ---

export async function fetchCoursesFromFirebase(): Promise<TravelCourse[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COURSES_COL));
    if (querySnapshot.empty) {
      return [];
    }
    const courses: TravelCourse[] = [];
    querySnapshot.forEach((docSnap) => {
      courses.push({ id: docSnap.id, ...docSnap.data() } as TravelCourse);
    });
    return courses;
  } catch (error) {
    console.warn('Error fetching courses from Firebase:', error);
    return [];
  }
}

export function subscribeCoursesFromFirebase(onUpdate: (courses: TravelCourse[]) => void) {
  try {
    const q = collection(db, COURSES_COL);
    return onSnapshot(q, (snapshot) => {
      const courses: TravelCourse[] = [];
      snapshot.forEach((docSnap) => {
        courses.push({ id: docSnap.id, ...docSnap.data() } as TravelCourse);
      });
      if (courses.length > 0) {
        onUpdate(courses);
      }
    }, (error) => {
      console.warn('Firebase courses subscription error:', error);
    });
  } catch (e) {
    console.warn('Failed to subscribe to Firebase courses:', e);
    return () => {};
  }
}

export async function seedInitialCoursesToFirebase(initialCourses: TravelCourse[]) {
  try {
    for (const course of initialCourses) {
      const courseRef = doc(db, COURSES_COL, course.id);
      const docSnap = await getDoc(courseRef);
      if (!docSnap.exists()) {
        await setDoc(courseRef, course);
      }
    }
  } catch (e) {
    console.warn('Error seeding initial courses to Firebase:', e);
  }
}

export async function updateCourseInFirebase(course: TravelCourse) {
  try {
    const courseRef = doc(db, COURSES_COL, course.id);
    await setDoc(courseRef, course, { merge: true });
  } catch (e) {
    console.warn('Error updating course in Firebase:', e);
  }
}

export async function incrementCourseLikeInFirebase(courseId: string) {
  try {
    const courseRef = doc(db, COURSES_COL, courseId);
    await updateDoc(courseRef, {
      likes: increment(1)
    });
  } catch (e) {
    console.warn('Error incrementing like in Firebase:', e);
  }
}

export async function incrementCourseViewInFirebase(courseId: string) {
  try {
    const courseRef = doc(db, COURSES_COL, courseId);
    await updateDoc(courseRef, {
      views: increment(1)
    });
  } catch (e) {
    console.warn('Error incrementing view in Firebase:', e);
  }
}

// --- Settings Operations ---

export async function fetchSettingsFromFirebase(): Promise<WebsiteSettings | null> {
  try {
    const docRef = doc(db, SETTINGS_COL, 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as WebsiteSettings;
    }
    return null;
  } catch (e) {
    console.warn('Error fetching settings from Firebase:', e);
    return null;
  }
}

export async function saveSettingsToFirebase(settings: WebsiteSettings) {
  try {
    const docRef = doc(db, SETTINGS_COL, 'main');
    await setDoc(docRef, settings, { merge: true });
  } catch (e) {
    console.warn('Error saving settings to Firebase:', e);
  }
}

// --- Proposals Operations ---

export async function fetchProposalsFromFirebase(): Promise<CourseProposal[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PROPOSALS_COL));
    const proposals: CourseProposal[] = [];
    querySnapshot.forEach((docSnap) => {
      proposals.push({ id: docSnap.id, ...docSnap.data() } as CourseProposal);
    });
    return proposals;
  } catch (e) {
    console.warn('Error fetching proposals from Firebase:', e);
    return [];
  }
}

export function subscribeProposalsFromFirebase(onUpdate: (proposals: CourseProposal[]) => void) {
  try {
    const q = collection(db, PROPOSALS_COL);
    return onSnapshot(q, (snapshot) => {
      const proposals: CourseProposal[] = [];
      snapshot.forEach((docSnap) => {
        proposals.push({ id: docSnap.id, ...docSnap.data() } as CourseProposal);
      });
      onUpdate(proposals);
    }, (e) => {
      console.warn('Proposals subscription error:', e);
    });
  } catch (e) {
    console.warn('Failed to subscribe to proposals:', e);
    return () => {};
  }
}

export async function createProposalInFirebase(proposal: Omit<CourseProposal, 'id' | 'createdAt' | 'status'> & { id?: string }): Promise<CourseProposal> {
  const newProposal: CourseProposal = {
    ...proposal,
    id: proposal.id || `proposal-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'pending'
  };

  try {
    const docRef = doc(db, PROPOSALS_COL, newProposal.id);
    await setDoc(docRef, newProposal);
  } catch (e) {
    console.warn('Error creating proposal in Firebase:', e);
  }

  return newProposal;
}

export async function updateProposalInFirebase(id: string, updates: Partial<CourseProposal>) {
  try {
    const docRef = doc(db, PROPOSALS_COL, id);
    await updateDoc(docRef, updates);
  } catch (e) {
    console.warn('Error updating proposal in Firebase:', e);
  }
}

export async function deleteProposalFromFirebase(id: string) {
  try {
    const docRef = doc(db, PROPOSALS_COL, id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Error deleting proposal from Firebase:', e);
  }
}
