class Role {
    constructor({ ID, title, salary, departmentID }) {
        this.ID = ID;
        this.title = title;
        this.salary = salary;
        this.departmentID = departmentID;
    }

    /*    async saveRole() {
        await fetch('/apis/add?type=role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: this.title,
                salary: this.salary,
                departmentID: this.departmentID,
            }),
        });
    } */

    static async viewAll() {
        const reponse = await fetch(
            'http://localhost:3001/api/viewAll?type=roles'
        );
        const roles = await reponse.json();
        console.table(roles);
    }
}

module.exports = Role;
