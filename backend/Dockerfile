# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and configuration
COPY .mvn/ .mvn
COPY mvnw mvnw
COPY pom.xml pom.xml

# Ensure execution permission for Maven wrapper and download dependencies (go-offline)
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy project source code
COPY src src

# Build the application jar
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the packaged jar from build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the default server port
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
