FROM adoptopenjdk/openjdk11 as build

# Set the working directory inside the container
# mkdir app && cd app
WORKDIR /app

# Copy maven executable into image
COPY mvnw .
COPY .mvn .mvn

# Copy pom.xml file
COPY pom.xml .

# Build all dependencies in preparation to go offline.
# This is a separate step so the dependencies will be cached unless
# the pom.xml file has changed.
RUN ./mvnw dependency:go-offline -B

# Copy the project source
COPY src src

# Package the application
RUN ./mvnw package
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

#### Stage 2: A minimal docker image with command to run the app
FROM adoptopenjdk/openjdk11:ubi

ARG DEPENDENCY=/app/target/dependency

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","com.msafo.blogapp.BlogAppApplication"]