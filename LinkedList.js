// Necessary Imports (you will need to use this)
const { Student } = require('./Student')

/**
 * Node Class (GIVEN, you will need to use this)
 */
class Node {
  // Public Fields
  data               // Student
  next               // Object
  /**
   * REQUIRES:  The fields specified above
   * EFFECTS:   Creates a new Node instance
   * RETURNS:   None
   */
  constructor(data, next = null) {
    this.data = data;
    this.next = next
  }
}

/**
 * Create LinkedList Class (for student management)
 * The class should have the public fields:
 * - head, tail, length
 */
class LinkedList {
  // Public Fields
  head              // Object
  tail              // Object
  length            // Number representing size of LinkedList

  /**
   * REQUIRES:  None
   * EFFECTS:   Creates a new LinkedList instance (empty)
   * RETURNS:   None
   */
  constructor() {
   this.head = null;
   this.tail = null;
   this.length = 0;
  }

  /**
   * REQUIRES:  A new student (Student)
   * EFFECTS:   Adds a Student to the end of the LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about adding to the 'end' of the LinkedList (Hint: tail)
   */
  addStudent(newStudent) {
    const newNode = new Node(newStudent) // wraps student inside the node ~ new student

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  this.length++;
  }

  /**
   * REQUIRES:  email(String)
   * EFFECTS:   Removes a student by email (assume unique)
   * RETURNS:   None
   * CONSIDERATIONS:
   * - Think about the null case
   * - Think about how removal might update head or tail
   */
  removeStudent(email) {
   if (!this.head) return false;

   if (this.head.data.getEmail() === email) {
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return;
   }

   let current = this.head;
   while (current.next && current.next.data.getEmail() !== email) {
    current = current.next;
   }
   
   if (current.next) {
    current.next = current.next.next;
    
    if (!current.next) this.tail = current;
    this.length--;
    return true;
   }
return false;
  }

  /**
   * REQUIRES:  email (String)
   * EFFECTS:   None
   * RETURNS:   The Student or -1 if not found
   */
  findStudent(email) {
    let current = this.head;
    while (current) {
      if (current.data.getEmail() === email) return current.data;
      current = current.next;
    }
    return -1
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   Clears all students from the Linked List
   * RETURNS:   None
   */
  #clearStudents() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   LinkedList as a String for console.log in caller
   * CONSIDERATIONS:
   *  - Let's assume you have a LinkedList with two people
   *  - Output should appear as: "JohnDoe, JaneDoe"
   */
  displayStudents() {
    let names = [];
    let current = this.head;
    while (current) {
      names.push(current.data.getName());
      current =current.next
    }
    return names.join(", ");  
  }

  /**
   * REQUIRES:  None
   * EFFECTS:   None
   * RETURNS:   A sorted array of students by name
   */
  #sortStudentsByName() {
    const students = [];
    let current = this.head;
    while (current) {
      students.push(current.data);
      current = current.next;
    }
    students.sort((a, b) => a.getName().localeCompare(b.getName()));
    return students;
  }

  /**
   * REQUIRES:  specialization (String)
   * EFFECTS:   None
   * RETURNS:   An array of students matching the specialization, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterBySpecialization(specialization) {
    const sorted = this.#sortStudentsByName();
    const filteredStudents =  sorted.filter(s => s.getSpecialization() === specialization);
    return filteredStudents;
  }

  /**
   * REQUIRES:  minAge (Number)
   * EFFECTS:   None
   * RETURNS:   An array of students who are at least minAge, sorted alphabetically by student name
   * CONSIDERATIONS:
   * - Use sortStudentsByName()
   */
  filterByMinAge(minAge) {
    const sorted = this.#sortStudentsByName();
    return sorted.filter(s => s.getYear() >= minAge);
  }

  /**
   * REQUIRES:  A valid file name (String)
   * EFFECTS:   Writes the LinkedList to a JSON file with the specified file name
   * RETURNS:   None
   */
  async saveToJson(fileName) {
    const fs = require('fs/promises');
    let current = this.head;
    const studentArray = [];
    
    while (current) {
      const student = current.data;
      studentArray.push({
        name: student.getName(),
        year: student.getYear(),
        email: student.getEmail(),
        specialization: student.getSpecialization()
      });
      current = current.next;
    }

    await fs.writeFile(fileName, JSON.stringify(studentArray, null, 2)); 
  }

  /**
   * REQUIRES:  A valid file name (String) that exists
   * EFFECTS:   Loads data from the specified fileName, overwrites existing LinkedList
   * RETURNS:   None
   * CONSIDERATIONS:
   *  - Use clearStudents() to perform overwriting
   */
  async loadFromJSON(fileName) {
    const fs = require('fs/promises');
    const data = await fs.readFile(fileName, 'utf-8');
    const studentArray = JSON.parse(data);

    this.#clearStudents();

    for (let i = 0; i < studentArray.length; i++) {
      const studentData = studentArray[i];
      
      const student = new Student(
        studentData.name,
        studentData.year,
        studentData.email,
        studentData.specialization
      );
    
      this.addStudent(student); // add each student
    }
}
}
module.exports = { LinkedList }
