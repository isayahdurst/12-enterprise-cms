

INSERT INTO Departments (name) VALUES
    ("IT"),
    ("HR"),
    ("Marketing"),
    ("Finance");

INSERT INTO Roles (title, salary, department_id) VALUES
    ("Software Developer", 80000, 1),
    ("Human Resources Manager", 75000, 2),
    ("Marketing Manager", 90000, 3),
    ("Financial Analyst", 85000, 4);

INSERT INTO Employees (first_name, last_name, role_id, manager_id) VALUES
    ("John", "Doe", 1, null),
    ("Jane", "Smith", 2, null),
    ("Bob", "Johnson", 3, 2),
    ("Emily", "Williams", 4, 3),
    ("Michael", "Brown", 1, 1),
    ("Jessica", "Jones", 2, 2);