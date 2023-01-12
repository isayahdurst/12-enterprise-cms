DROP DATABASE IF EXISTS EMPLOYER_CMS;
CREATE DATABASE EMPLOYER_CMS;

USE EMPLOYER_CMS;

CREATE TABLE Departments(
    id int not null primary key auto_increment,
    name varchar(30)
);

CREATE TABLE Roles(
    id int not null primary key auto_increment,
    title varchar(30),
    salary decimal,
    department_id int not null,
    foreign key (department_id) references Departments(id) on delete cascade
);

CREATE TABLE Employees(
    id int not null primary key auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    foreign key (role_id) references Roles(id) on delete cascade,
    foreign key (manager_id) references Employees(id)
);



