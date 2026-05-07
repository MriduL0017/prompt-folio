# Stage 1: Build the native image
FROM ghcr.io/graalvm/native-image-community:17-ol9 AS builder

WORKDIR /app
COPY pom.xml .
COPY src src

# We use Maven Wrapper if available, but since we didn't generate one, we'll install maven
RUN microdnf install maven -y

RUN mvn -Pnative native:compile -DskipTests

# Stage 2: Create a minimal image
FROM oraclelinux:9-micro

WORKDIR /app
COPY --from=builder /app/target/promptfolio-data-service .

EXPOSE 8080
CMD ["./promptfolio-data-service"]
