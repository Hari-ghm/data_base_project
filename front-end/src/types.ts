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

export interface AllocatedCourses {
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
  faculty:string;
  basket: string;
  empid:number;
}


export interface Faculty {
  id: string;
  name: string;
  empid: number;
  photo_url: string;
  email:string;
  school:string;
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  school: string;
}