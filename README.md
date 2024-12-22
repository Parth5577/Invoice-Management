# Invoice Management System - Backend

## Overview

This backend service is part of the Invoice Management System, providing a robust API for creating, updating, viewing, and managing invoices. The application is built using **Node.js** with the **NestJS framework** and leverages **TypeORM** for seamless database interactions with MySQL.

## Features

### Core Functionalities


1. **Create Invoice**
   * API to create a new invoice capturing:
     * `From` details: Name, Address
     * `To` details: Name, Address
     * `Item` details: Item Name, Quantity, Rate, and Total (calculated as `Quantity * Rate`)
   * Supports dynamic addition of multiple items for a single invoice.
2. **Update Invoice**
   * API to update existing invoice details, including the ability to modify `From`, `To`, and `Item` information.
3. **Get Invoice Details**
   * Retrieve detailed information for a specific invoice, including:
     * `From` and `To` details
     * List of items with `Name`, `Quantity`, `Rate`, and `Total`
     * Total amount for the invoice
4. **List Invoices**
   * API to fetch a paginated list of all invoices with sorting by Invoice Date.
   * Supports query filters for searching by:
     * Invoice Number
     * `From` Name
     * `To` Name
     * Invoice Date
5. **Common Response Interceptor**
   * Unified structure for API responses, ensuring consistency across all endpoints.
6. **Global Error Handling**
   * A centralized error handler that manages exceptions and provides meaningful error messages.

### Additional Features

* **Dockerized Backend**
  * The backend service is fully containerized using Docker, enabling seamless deployment and portability.
  * Includes a `Dockerfile` and `docker-compose.yml` for easy setup.
* **Scalable Design**
  * Follows Dependency Injection (DI) and Inversion of Control (IoC) principles for maintainability and scalability.

## Technology Stack

* **Node.js** with **NestJS**
* **TypeORM** for database operations
* **MySQL** for data storage


