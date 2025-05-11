export interface Course {
  id: string;
  year: number;
  stream: string;
  courseType: string;
  courseCode: string;
  courseTitle: string;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  credits: number;
  prerequisites: string;
  school: string;
  forenoonSlots: number;
  afternoonSlots: number;
  totalSlots: number;
  basket: string;
}


export interface CourseAllocation {
  id: string;
  courseId: string;
  userId: string;
  slotType: 'FN' | 'AN';
  timestamp: string;
}

export interface CourseData {
  id: string;
  year: string;
  stream: string;
  courseType: string;
  courseCode: string;
  courseTitle: string;
  lectureHours: string;
  tutorialHours: string;
  practicalHours: string;
  credits: string;
  prerequisites: string;
  school: string;
  forenoonSlots: string;
  afternoonSlots: string;
  faculty: string;
  basket: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  imageUrl: string;
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  school: string;
}