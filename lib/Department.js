class Department {
    constructor({ ID, name }) {
        this.name = name;
        this.ID = ID;
    }

    static async viewAll() {
        const reponse = await fetch(
            'http://localhost:3001/api/viewAll?type=departments'
        );
        const departments = await reponse.json();
        console.table(departments);
        return departments;
    }

    static async remove(departmentID) {
        const response = await fetch(
            'http://localhost:3001/api/departments/delete',
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: departmentID }),
            }
        );
    }

    static async add(name) {
        const response = await fetch(
            'http://localhost:3001/api/departments/add',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ departmentName: name }),
            }
        );
    }

    static async findID(name) {
        const response = await fetch(
            'http://localhost:3001/api/departments/' + name
        );
        const deptID = await response.json();
        return deptID;
    }
}

module.exports = Department;
