package com.studentleave;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DatabaseBuilder {

    public static void main(String[] args) {
        // The URL for the SQLite database. If it doesn't exist, SQLite creates it!
        String url = "jdbc:sqlite:custom_database.db";

        try (Connection conn = DriverManager.getConnection(url);
             Statement stmt = conn.createStatement()) {

            System.out.println("✅ Connected to SQLite. Database file created!");

            // 1. Create the Users table
            String createUsersTable = "CREATE TABLE IF NOT EXISTS users ("
                    + " id INTEGER PRIMARY KEY AUTOINCREMENT,"
                    + " name TEXT NOT NULL,"
                    + " role TEXT NOT NULL"
                    + ");";
            stmt.execute(createUsersTable);
            System.out.println("✅ Created 'users' table.");

            // 2. Create the LeaveRequest table
            String createLeaveTable = "CREATE TABLE IF NOT EXISTS leave_request ("
                    + " id INTEGER PRIMARY KEY AUTOINCREMENT,"
                    + " student_id INTEGER,"
                    + " start_date TEXT NOT NULL,"
                    + " end_date TEXT NOT NULL,"
                    + " reason TEXT NOT NULL,"
                    + " status TEXT,"
                    + " FOREIGN KEY (student_id) REFERENCES users(id)"
                    + ");";
            stmt.execute(createLeaveTable);
            System.out.println("✅ Created 'leave_request' table.");

            System.out.println("🎉 Database creation complete!");

        } catch (Exception e) {
            System.out.println("❌ Error creating database: " + e.getMessage());
        }
    }
}
