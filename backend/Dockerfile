# ===== Stage 1: Build =====
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml trước để cache dependencies (tránh download lại khi chỉ đổi code)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source và build JAR
COPY src ./src
RUN mvn package -DskipTests -B

# ===== Stage 2: Runtime =====
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy JAR từ build stage
COPY --from=builder /app/target/*.jar app.jar

# FIX: Railway inject PORT env var động (không phải cố định 8081)
# Dùng shell script để đọc $PORT khi khởi động
# Nếu không có PORT thì fallback về 8081 (local dev)
EXPOSE 8081

# FIX: Dùng shell form để Railway có thể inject PORT env var
# -Dserver.port=${PORT:-8081} đọc PORT từ Railway, fallback 8081
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8081} -jar app.jar"]