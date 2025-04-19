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