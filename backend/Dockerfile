# Use OpenJDK 21 base image
FROM eclipse-temurin:21-jdk

# Create app directory
WORKDIR /app

# Copy JAR from target folder to app directory
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8081

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
